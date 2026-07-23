const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');
const { movieValidationRules, movieIdValidationRules } = require('../validators/movies');
const { validate } = require('../validators/validate');

router.get('/', moviesController.getAll);
router.get('/:id', movieIdValidationRules(), validate, moviesController.getSingle);
router.post('/', movieValidationRules(), validate, moviesController.createMovie);
router.put('/:id', movieIdValidationRules(), movieValidationRules(), validate, moviesController.updateMovie);
router.delete('/:id', movieIdValidationRules(), validate, moviesController.deleteMovie);

module.exports = router;
