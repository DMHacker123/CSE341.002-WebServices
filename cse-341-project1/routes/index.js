const router = require('express').Router();

router.use('/contacts', require('./contacts'));

router.get('/', (req, res) => {
  res.send('Contacts API is running!');
});

module.exports = router;