const nodemailer = require('nodemailer');

/**
 * Create Nodemailer transporter
 * Uses Gmail SMTP with App Password
 * 
 * Setup:
 * 1. Go to Google Account → Security → 2-Step Verification (enable)
 * 2. Go to Google Account → Security → App Passwords
 * 3. Generate app password for "Mail" → "Other"
 * 4. Copy the 16-char password to .env GMAIL_APP_PASSWORD
 */
function createTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD must be configured in .env');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Send a single email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Optional plain text fallback
 * @returns {Object} Send result
 */
async function sendEmail(to, subject, html, text = '') {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Testdi" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML as fallback
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * Send bulk emails with rate limiting
 * Sends in batches of 10, with 2s delay between batches
 * to avoid Gmail rate limits (max ~100/day for free accounts)
 * 
 * @param {string[]} emails - Array of recipient emails
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} text - Optional plain text
 * @param {Function} onProgress - Optional callback(sentCount, failedCount)
 * @returns {Object} { sentCount, failedCount, failedEmails }
 */
async function sendBulkEmails(emails, subject, html, text = '', onProgress = null) {
  const BATCH_SIZE = 10;
  const BATCH_DELAY_MS = 2000;

  let sentCount = 0;
  let failedCount = 0;
  const failedEmails = [];

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);

    // Send batch in parallel
    const results = await Promise.allSettled(
      batch.map(email => sendEmail(email, subject, html, text))
    );

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        sentCount++;
      } else {
        failedCount++;
        failedEmails.push(batch[idx]);
        if (process.env.NODE_ENV === 'development') {
          console.error(`Failed to send to ${batch[idx]}:`, result.reason?.message);
        }
      }
    });

    if (onProgress) {
      onProgress(sentCount, failedCount);
    }

    // Delay between batches (skip for last batch)
    if (i + BATCH_SIZE < emails.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  return { sentCount, failedCount, failedEmails };
}

/**
 * Verify email configuration is working
 * @returns {boolean}
 */
async function verifyEmailConfig() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email config error:', error.message);
    return false;
  }
}

module.exports = {
  sendEmail,
  sendBulkEmails,
  verifyEmailConfig,
};
