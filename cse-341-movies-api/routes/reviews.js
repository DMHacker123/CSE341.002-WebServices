const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');
const { reviewValidationRules, reviewIdValidationRules } = require('../validators/reviews');
const { validate } = require('../validators/validate');

router.get('/', reviewsController.getAll);
router.get('/:id', reviewIdValidationRules(), validate, reviewsController.getSingle);
router.post('/', reviewValidationRules(), validate, reviewsController.createReview);
router.put('/:id', reviewIdValidationRules(), reviewValidationRules(), validate, reviewsController.updateReview);
router.delete('/:id', reviewIdValidationRules(), validate, reviewsController.deleteReview);

module.exports = router;
