const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Star Wars Quotes API',
    description: 'API for retrieving Star Wars quotes'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
