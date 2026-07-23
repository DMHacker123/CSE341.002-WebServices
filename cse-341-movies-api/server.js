require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const mongodb = require('./db/connect');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let swaggerFile;
try {
  swaggerFile = require('./swagger-output.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
} catch (err) {
  console.log('Swagger docs not generated yet. Run npm run swagger-autogen first.');
}

app.use('/', require('./routes'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on port ${port}`);
    });
  }
});
