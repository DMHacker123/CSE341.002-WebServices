require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createHandler } = require('graphql-http/lib/use/express');
const mongodb = require('./db/connect');
const { schema, root } = require('./schema/schema');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.all('/graphql', createHandler({ schema, rootValue: root }));

app.get('/', (req, res) => {
  res.send('GraphQL Books API is running! Visit /graphiql.html to explore, or POST to /graphql directly.');
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
