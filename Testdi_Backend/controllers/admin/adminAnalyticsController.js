const SBTIResult = require('../../models/SBTIResult');
const PageView = require('../../models/PageView');
const { successResponse } = require('../../utils/responseHandler');

/**
 * GET /api/admin/analytics/archetype-distribution
 * Distribution of test results by archetype code, with rarity levels
 */
async function getArchetypeDistribution(req, res, next) {
  try {
    const totalTests = await SBTIResult.countDocuments();

    const distribution = await SBTIResult.aggregate([
      {
        $group: {
          _id: '$mainType.code',
          count: { $sum: 1 },
          desc: { $first: '$mainType.desc' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Calculate percentages and assign rarity
    const result = distribution.map(item => {
      const percentage = totalTests > 0
        ? parseFloat(((item.count / totalTests) * 100).toFixed(1))
        : 0;

      let rarity;
      if (percentage < 2) rarity = 'LEGENDARY';
      else if (percentage < 5) rarity = 'RARE';
      else if (percentage < 10) rarity = 'UNCOMMON';
      else rarity = 'COMMON';

      return {
        code: item._id,
        desc: item.desc,
        count: item.count,
        percentage,
        rarity,
      };
    });

    return successResponse(res, 'Archetype distribution retrieved successfully', {
      totalTests,
      distribution: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/analytics/traffic?period=7d|30d|90d
 * Traffic stats grouped by date
 */
async function getTrafficStats(req, res, next) {
  try {
    const period = req.query.period || '7d';
    const days = parseInt(period) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Page views by day
    const pageViewsByDay = await PageView.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          views: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Tests by day
    const testsByDay = await SBTIResult.aggregate([
      { $match: { completedAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
          },
          tests: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Merge page views and tests by date
    const testsMap = {};
    testsByDay.forEach(t => { testsMap[t._id] = t.tests; });

    const traffic = pageViewsByDay.map(pv => ({
      ...pv,
      testsTaken: testsMap[pv.date] || 0,
    }));

    return successResponse(res, 'Traffic stats retrieved successfully', {
      period,
      traffic,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/analytics/test-stats
 * Detailed test statistics
 */
async function getTestStats(req, res, next) {
  try {
    const totalTests = await SBTIResult.countDocuments();

    // Confidence distribution
    const confidenceDistribution = await SBTIResult.aggregate([
      {
        $group: {
          _id: '$confidence',
          count: { $sum: 1 },
        },
      },
    ]);

    // Scoring method distribution (NORMAL, DRUNK_OVERRIDE, HHHH_FALLBACK)
    const methodDistribution = await SBTIResult.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $eq: ['$mainType.code', 'DRUNK'] }, then: 'DRUNK_OVERRIDE' },
                { case: { $eq: ['$mainType.code', 'HHHH'] }, then: 'HHHH_FALLBACK' },
              ],
              default: 'NORMAL',
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Average similarity score
    const avgScore = await SBTIResult.aggregate([
      {
        $group: {
          _id: null,
          avgSimilarity: { $avg: '$mainType.score' },
          avgDistance: { $avg: '$mainType.distance' },
        },
      },
    ]);

    return successResponse(res, 'Test statistics retrieved successfully', {
      totalTests,
      confidenceDistribution: confidenceDistribution.reduce((acc, c) => {
        acc[c._id] = c.count;
        return acc;
      }, {}),
      methodDistribution: methodDistribution.reduce((acc, m) => {
        acc[m._id] = m.count;
        return acc;
      }, {}),
      averages: avgScore[0] ? {
        similarity: parseFloat((avgScore[0].avgSimilarity || 0).toFixed(1)),
        distance: parseFloat((avgScore[0].avgDistance || 0).toFixed(1)),
      } : { similarity: 0, distance: 0 },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/analytics (legacy endpoint)
 */
async function getAnalytics(req, res, next) {
  try {
    const totalTests = await SBTIResult.countDocuments();
    const totalRegisteredUsers = await SBTIResult.countDocuments({ userId: { $ne: null } });
    const totalGuests = await SBTIResult.countDocuments({ guestId: { $ne: null } });

    // Get archetype distribution
    const archetypeDistribution = await SBTIResult.aggregate([
      {
        $group: {
          _id: '$personalityArchetypeId',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return successResponse(res, 'Legacy analytics retrieved successfully', {
      summary: {
        totalTests,
        totalRegisteredUsers,
        totalGuests,
      },
      archetypeDistribution,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getArchetypeDistribution,
  getTrafficStats,
  getTestStats,
  getAnalytics,
};
