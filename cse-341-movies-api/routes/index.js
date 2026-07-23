const router = require('express').Router();

router.use('/movies', require('./movies'));
router.use('/reviews', require('./reviews'));

router.get('/', (req, res) => {
  res.send('Movies API is running!');
});

module.exports = router;
