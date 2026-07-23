const { body, param } = require('express-validator');

const reviewValidationRules = () => {
  return [
    body('movieId').isMongoId().withMessage('movieId must be a valid MongoDB ObjectId'),
    body('reviewerName').trim().notEmpty().withMessage('reviewerName is required'),
    body('rating').isInt({ min: 1, max: 10 }).withMessage('rating must be a number between 1 and 10'),
    body('comment').trim().notEmpty().withMessage('comment is required'),
    body('reviewDate').isISO8601().withMessage('reviewDate must be a valid date (YYYY-MM-DD)'),
  ];
};

const reviewIdValidationRules = () => {
  return [param('id').isMongoId().withMessage('id must be a valid MongoDB ObjectId')];
};

module.exports = { reviewValidationRules, reviewIdValidationRules };
