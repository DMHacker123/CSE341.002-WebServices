// app.js
const express = require('express'); // Import express module
const app = express();
const port = 3000;

// Handle GET requests targeting the root URL path
app.get('/', (req, res) => {
  res.send('Darwin Matos!'); // Sends response and automatically handles content headers
});

// Open listening port
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
