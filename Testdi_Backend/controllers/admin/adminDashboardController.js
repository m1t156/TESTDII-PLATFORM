const Question = require('../../models/Question');
const SBTIResult = require('../../models/SBTIResult');
const User = require('../../models/User');
const PageView = require('../../models/PageView');
const { successResponse } = require('../../utils/responseHandler');

/**
 * GET /api/admin/dashboard
 * Main dashboard summary: users, tests, traffic overview
 */
async function getDashboard(req, res, next) {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(todayStart);
    monthStart.setDate(monthStart.getDate() - 30);

    // Parallel queries for performance
    const [
      totalUsers,
      totalGuests,
      totalTests,
      testsToday,
      testsThisWeek,
      testsThisMonth,
      pageViewsToday,
      uniqueVisitorsToday,
      totalQuestions,
    ] = await Promise.all([
      User.countDocuments({ isGuest: false }),
      SBTIResult.countDocuments({ guestId: { $ne: null } }),
      SBTIResult.countDocuments(),
      SBTIResult.countDocuments({ completedAt: { $gte: todayStart } }),
      SBTIResult.countDocuments({ completedAt: { $gte: weekStart } }),
      SBTIResult.countDocuments({ completedAt: { $gte: monthStart } }),
      PageView.countDocuments({ createdAt: { $gte: todayStart } }),
      PageView.distinct('sessionId', { createdAt: { $gte: todayStart } }).then(r => r.length),
      Question.countDocuments(),
    ]);

    return successResponse(res, 'Dashboard summary retrieved successfully', {
      dashboard: {
        users: {
          totalRegistered: totalUsers,
          totalGuests,
        },
        tests: {
          total: totalTests,
          today: testsToday,
          thisWeek: testsThisWeek,
          thisMonth: testsThisMonth,
        },
        traffic: {
          pageViewsToday,
          uniqueVisitorsToday,
        },
        content: {
          totalQuestions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
};
