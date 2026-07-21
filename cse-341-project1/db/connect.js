const { MongoClient } = require('mongodb');

let client;

const initDb = async (callback) => {
  if (client) {
    console.log('Db is already initialized!');
    return callback(null, client);
  }

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    callback(null, client);
  } catch (err) {
    callback(err);
  }
};

const getDb = () => {
  if (!client) {
    throw Error('Db not initialized');
  }
  return client;
};

module.exports = { initDb, getDb };
