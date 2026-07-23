const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movies API',
    description: 'CRUD API for movies and reviews'
  },
  host: process.env.NODE_ENV === 'production'
    ? 'your-render-url-here.onrender.com'
    : 'localhost:3000',
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
