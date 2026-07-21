const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'CRUD API for managing contacts'
  },
  host: process.env.NODE_ENV === 'production'
    ? 'cse-341-project1-93ir.onrender.com'
    : 'localhost:3000',
  schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
