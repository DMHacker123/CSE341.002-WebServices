const { body, param } = require('express-validator');

const movieValidationRules = () => {
  return [
    body('title').trim().notEmpty().withMessage('title is required'),
    body('director').trim().notEmpty().withMessage('director is required'),
    body('releaseYear')
      .isInt({ min: 1888, max: new Date().getFullYear() + 1 })
      .withMessage('releaseYear must be a valid year'),
    body('genre').trim().notEmpty().withMessage('genre is required'),
    body('runtimeMinutes')
      .isInt({ min: 1 })
      .withMessage('runtimeMinutes must be a positive number'),
    body('rating').trim().notEmpty().withMessage('rating is required'),
    body('synopsis').trim().notEmpty().withMessage('synopsis is required'),
    body('posterUrl').optional({ checkFalsy: true }).isURL().withMessage('posterUrl must be a valid URL'),
  ];
};

const movieIdValidationRules = () => {
  return [param('id').isMongoId().withMessage('id must be a valid MongoDB ObjectId')];
};

module.exports = { movieValidationRules, movieIdValidationRules };
