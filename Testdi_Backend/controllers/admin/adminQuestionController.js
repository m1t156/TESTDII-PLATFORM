const Question = require('../../models/Question');
const { isValidDimension, isValidMeasure } = require('../../utils/validator');
const { ERROR_MESSAGES, MEASURES_MAP } = require('../../config/constants');
const { successResponse, errorResponse } = require('../../utils/responseHandler');

/**
 * Helper: Auto-calculate dimensionIndex from dimension + measure
 */
function calculateDimensionIndex(dimension, measure) {
  const measureList = Object.values(MEASURES_MAP).flat();
  const idx = measureList.findIndex(m => m === measure.toUpperCase());
  return idx >= 0 ? idx : -1;
}

/**
 * GET /api/admin/questions?testType=SBTI&dimension=SELF&measure=S1
 * Get all questions (admin view - unshuffled, original order)
 */
async function getAllQuestions(req, res, next) {
  try {
    const { testType, dimension, measure } = req.query;

    const filter = {};
    if (testType) filter.testType = testType;
    if (dimension) filter.dimension = dimension;
    if (measure) filter.measure = measure;

    const questions = await Question.find(filter).sort({ testType: 1, order: 1 });

    return successResponse(res, 'Questions retrieved successfully', {
      total: questions.length,
      questions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/questions
 * Create new question (auto-calculates dimensionIndex)
 */
async function createQuestion(req, res, next) {
  try {
    const { testType, questionText, dimension, measure, options, order, isBonus, dimensionIndex } = req.body;

    // Validation
    if (!questionText || !dimension || !measure || !options) {
      return errorResponse(res, 'Missing required fields: questionText, dimension, measure, options', 400);
    }

    if (!isValidDimension(dimension)) {
      return errorResponse(res, 'Invalid dimension', 400);
    }

    if (!isValidMeasure(measure)) {
      return errorResponse(res, 'Invalid measure', 400);
    }

    if (!Array.isArray(options) || options.length === 0) {
      return errorResponse(res, 'At least one option is required', 400);
    }

    // Auto-calculate dimensionIndex if not provided
    const dimIdx = isBonus ? -1 : (dimensionIndex !== undefined ? dimensionIndex : calculateDimensionIndex(dimension, measure));

    // Auto-determine order if not provided
    let questionOrder = order;
    if (!questionOrder) {
      const lastQuestion = await Question.findOne({ testType: testType || 'SBTI' }).sort({ order: -1 });
      questionOrder = lastQuestion ? lastQuestion.order + 1 : 1;
    }

    const question = new Question({
      testType: testType || 'SBTI',
      questionText,
      dimension,
      measure,
      dimensionIndex: dimIdx,
      options: options.map(opt => ({
        text: opt.text,
        points: opt.points,
      })),
      order: questionOrder,
      isBonus: isBonus || false,
    });

    await question.save();

    return successResponse(res, 'Question created successfully', { question }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/questions/:questionId
 * Update question
 */
async function updateQuestion(req, res, next) {
  try {
    const { questionId } = req.params;
    const { questionText, dimension, measure, options, order, isBonus, dimensionIndex } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return errorResponse(res, ERROR_MESSAGES.QUESTION_NOT_FOUND, 404);
    }

    // Update fields if provided
    if (questionText) question.questionText = questionText;
    if (dimension) {
      if (!isValidDimension(dimension)) {
        return errorResponse(res, 'Invalid dimension', 400);
      }
      question.dimension = dimension;
    }
    if (measure) {
      if (!isValidMeasure(measure)) {
        return errorResponse(res, 'Invalid measure', 400);
      }
      question.measure = measure;
    }

    // Recalculate dimensionIndex if dimension or measure changed
    if (dimension || measure || dimensionIndex !== undefined) {
      if (dimensionIndex !== undefined) {
        question.dimensionIndex = dimensionIndex;
      } else if (question.isBonus) {
        question.dimensionIndex = -1;
      } else {
        question.dimensionIndex = calculateDimensionIndex(
          question.dimension,
          question.measure
        );
      }
    }

    if (options) {
      question.options = options.map(opt => ({
        text: opt.text,
        points: opt.points,
      }));
    }
    if (order !== undefined) question.order = order;
    if (isBonus !== undefined) {
      question.isBonus = isBonus;
      if (isBonus) question.dimensionIndex = -1;
    }

    question.updatedAt = new Date();
    await question.save();

    return successResponse(res, 'Question updated successfully', { question });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/admin/questions/:questionId
 * Delete question
 */
async function deleteQuestion(req, res, next) {
  try {
    const { questionId } = req.params;

    const question = await Question.findByIdAndDelete(questionId);
    if (!question) {
      return errorResponse(res, ERROR_MESSAGES.QUESTION_NOT_FOUND, 404);
    }

    return successResponse(res, 'Question deleted successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/admin/questions/bulk
 * Bulk import questions (for new test types)
 */
async function bulkImportQuestions(req, res, next) {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return errorResponse(res, 'Questions array is required', 400);
    }

    // Validate all questions before inserting
    const errors = [];
    const preparedQuestions = questions.map((q, i) => {
      if (!q.questionText) errors.push(`Question ${i + 1}: missing questionText`);
      if (!q.dimension) errors.push(`Question ${i + 1}: missing dimension`);
      if (!q.measure) errors.push(`Question ${i + 1}: missing measure`);
      if (!q.options || q.options.length === 0) errors.push(`Question ${i + 1}: missing options`);

      return {
        testType: q.testType || 'SBTI',
        questionText: q.questionText,
        dimension: q.dimension,
        measure: q.measure,
        dimensionIndex: q.isBonus ? -1 : (q.dimensionIndex !== undefined ? q.dimensionIndex : calculateDimensionIndex(q.dimension, q.measure)),
        options: (q.options || []).map(opt => ({
          text: opt.text,
          points: opt.points,
        })),
        order: q.order,
        isBonus: q.isBonus || false,
      };
    });

    if (errors.length > 0) {
      return errorResponse(res, 'Validation failed', 400, errors);
    }

    const inserted = await Question.insertMany(preparedQuestions);

    return successResponse(res, `${inserted.length} questions imported successfully`, {
      count: inserted.length,
    }, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/questions/export?testType=SBTI
 * Export questions as JSON (for backup)
 */
async function exportQuestions(req, res, next) {
  try {
    const testType = req.query.testType || 'SBTI';

    const questions = await Question.find({ testType }).sort({ order: 1 }).lean();

    // Clean up for export
    const exportData = questions.map(q => ({
      testType: q.testType,
      questionText: q.questionText,
      dimension: q.dimension,
      measure: q.measure,
      dimensionIndex: q.dimensionIndex,
      options: q.options.map(o => ({ text: o.text, points: o.points })),
      order: q.order,
      isBonus: q.isBonus,
    }));

    return successResponse(res, 'Questions exported successfully', {
      testType,
      exportedAt: new Date().toISOString(),
      total: exportData.length,
      questions: exportData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/admin/questions/reorder
 * Reorder questions: [{ id, newOrder }]
 */
async function reorderQuestions(req, res, next) {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      return errorResponse(res, 'Orders array is required: [{ id, newOrder }]', 400);
    }

    // Bulk update orders
    const bulkOps = orders.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.newOrder, updatedAt: new Date() } },
      },
    }));

    const result = await Question.bulkWrite(bulkOps);

    return successResponse(res, `${result.modifiedCount} questions reordered`, {
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkImportQuestions,
  exportQuestions,
  reorderQuestions,
};
