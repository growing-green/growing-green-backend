const mongoose = require('mongoose');
const { databaseURL } = require('../configs');

function connectMongoDB() {
  const db = mongoose.connection;
  mongoose.connect(databaseURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
  });

  db.users.createIndex({ email: 1 }, { unique: true });
  db.plants.createIndex({ name: 1 }, { unique: true });

  db.on('error', function () {
    console.log('Disconnected to database...');
    mongoose.disconnect();
  });

  db.once('open', function () {
    console.log('Connected to database...');
  });
}

module.exports = connectMongoDB;
