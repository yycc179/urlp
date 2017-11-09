const mongoose = require('mongoose')
    , config = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(config.db_url);

mongoose.connection.once('open', () =>
    console.log('db open')
);

module.exports = mongoose;