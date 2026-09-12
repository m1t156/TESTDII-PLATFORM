const adminDashboardController = require('./adminDashboardController');
const adminAnalyticsController = require('./adminAnalyticsController');
const adminQuestionController = require('./adminQuestionController');
const adminUserController = require('./adminUserController');

module.exports = {
  ...adminDashboardController,
  ...adminAnalyticsController,
  ...adminQuestionController,
  ...adminUserController,
};
