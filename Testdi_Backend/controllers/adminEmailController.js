const EmailCampaign = require('../models/EmailCampaign');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendBulkEmails, verifyEmailConfig } = require('../utils/emailService');

/**
 * GET /api/admin/emails/recipients
 * List all available email recipients (registered users + notification subscribers)
 */
async function getRecipients(req, res, next) {
  try {
    const search = req.query.search || '';

    // Get emails from registered users
    const userFilter = { isGuest: false, email: { $exists: true, $ne: null } };
    if (search) {
      userFilter.email = { $regex: search, $options: 'i' };
    }

    const users = await User.find(userFilter)
      .select('email username role createdAt')
      .sort({ createdAt: -1 });

    // Get emails from notification subscribers (not registered)
    const subscriberFilter = { isActive: true };
    if (search) {
      subscriberFilter.email = { $regex: search, $options: 'i' };
    }

    const subscribers = await Notification.find(subscriberFilter)
      .select('email subscriptions createdAt')
      .sort({ createdAt: -1 });

    // Merge and deduplicate
    const emailSet = new Set();
    const recipients = [];

    users.forEach(u => {
      if (u.email && !emailSet.has(u.email)) {
        emailSet.add(u.email);
        recipients.push({
          email: u.email,
          username: u.username,
          source: 'registered',
          role: u.role,
        });
      }
    });

    subscribers.forEach(s => {
      if (s.email && !emailSet.has(s.email)) {
        emailSet.add(s.email);
        recipients.push({
          email: s.email,
          username: null,
          source: 'subscriber',
          role: 'user',
        });
      }
    });

    res.json({
      total: recipients.length,
      recipients,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/emails/campaigns
 * List all email campaigns
 */
async function getCampaigns(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [campaigns, total] = await Promise.all([
      EmailCampaign.find()
        .populate('sentBy', 'email username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      EmailCampaign.countDocuments(),
    ]);

    res.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/emails/campaigns/:id
 * Get campaign detail
 */
async function getCampaign(req, res, next) {
  try {
    const campaign = await EmailCampaign.findById(req.params.id)
      .populate('sentBy', 'email username');

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ campaign });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/emails/campaigns
 * Create a new email campaign (draft)
 */
async function createCampaign(req, res, next) {
  try {
    const { subject, htmlContent, textContent, recipients, selectedEmails } = req.body;

    if (!subject || !htmlContent) {
      return res.status(400).json({ error: 'subject and htmlContent are required' });
    }

    if (!['all', 'selected'].includes(recipients)) {
      return res.status(400).json({ error: 'recipients must be "all" or "selected"' });
    }

    if (recipients === 'selected' && (!selectedEmails || selectedEmails.length === 0)) {
      return res.status(400).json({ error: 'selectedEmails required when recipients = "selected"' });
    }

    const campaign = new EmailCampaign({
      subject,
      htmlContent,
      textContent,
      recipients,
      selectedEmails: recipients === 'selected' ? selectedEmails : [],
      status: 'draft',
      sentBy: req.user.userId,
    });

    await campaign.save();

    res.status(201).json({
      message: 'Campaign created as draft',
      campaign,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/emails/campaigns/:id
 * Update a draft campaign
 */
async function updateCampaign(req, res, next) {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign.status !== 'draft') {
      return res.status(400).json({ error: 'Only draft campaigns can be edited' });
    }

    const { subject, htmlContent, textContent, recipients, selectedEmails } = req.body;

    if (subject) campaign.subject = subject;
    if (htmlContent) campaign.htmlContent = htmlContent;
    if (textContent !== undefined) campaign.textContent = textContent;
    if (recipients) {
      campaign.recipients = recipients;
      if (recipients === 'selected' && selectedEmails) {
        campaign.selectedEmails = selectedEmails;
      }
    }

    campaign.updatedAt = new Date();
    await campaign.save();

    res.json({
      message: 'Campaign updated',
      campaign,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/emails/campaigns/:id/send
 * Send the email campaign
 */
async function sendCampaign(req, res, next) {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign.status === 'sending') {
      return res.status(400).json({ error: 'Campaign is already being sent' });
    }

    if (campaign.status === 'sent') {
      return res.status(400).json({ error: 'Campaign has already been sent' });
    }

    // Verify email config first
    const isConfigured = await verifyEmailConfig();
    if (!isConfigured) {
      return res.status(500).json({
        error: 'Email service not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env',
      });
    }

    // Determine recipient list
    let emailList;
    if (campaign.recipients === 'all') {
      // Get all registered user emails + active subscribers
      const users = await User.find({
        isGuest: false,
        email: { $exists: true, $ne: null },
      }).select('email');

      const subscribers = await Notification.find({ isActive: true }).select('email');

      const emailSet = new Set();
      users.forEach(u => { if (u.email) emailSet.add(u.email); });
      subscribers.forEach(s => { if (s.email) emailSet.add(s.email); });
      emailList = Array.from(emailSet);
    } else {
      emailList = campaign.selectedEmails;
    }

    if (emailList.length === 0) {
      return res.status(400).json({ error: 'No recipients found' });
    }

    // Mark as sending
    campaign.status = 'sending';
    await campaign.save();

    // Send emails (this runs asynchronously)
    // We respond immediately and update status when done
    res.json({
      message: `Sending campaign to ${emailList.length} recipients...`,
      recipientCount: emailList.length,
      campaignId: campaign._id,
    });

    // Send in background
    try {
      const result = await sendBulkEmails(
        emailList,
        campaign.subject,
        campaign.htmlContent,
        campaign.textContent || ''
      );

      campaign.sentCount = result.sentCount;
      campaign.failedCount = result.failedCount;
      campaign.failedEmails = result.failedEmails;
      campaign.sentAt = new Date();
      campaign.status = result.failedCount === 0 ? 'sent'
        : result.sentCount === 0 ? 'failed'
        : 'partial';

      await campaign.save();
    } catch (sendError) {
      campaign.status = 'failed';
      await campaign.save();
      console.error('Campaign send error:', sendError.message);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/emails/campaigns/:id
 * Delete a draft campaign
 */
async function deleteCampaign(req, res, next) {
  try {
    const campaign = await EmailCampaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign.status === 'sending') {
      return res.status(400).json({ error: 'Cannot delete a campaign that is currently sending' });
    }

    await EmailCampaign.findByIdAndDelete(req.params.id);

    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/emails/verify
 * Check if email service is configured
 */
async function verifyEmail(req, res, next) {
  try {
    const isConfigured = await verifyEmailConfig();
    res.json({
      configured: isConfigured,
      gmailUser: process.env.GMAIL_USER || 'not set',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRecipients,
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  sendCampaign,
  deleteCampaign,
  verifyEmail,
};
