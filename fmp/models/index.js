var config = require('../config');
var mongoose = require('mongoose');

mongoose.connect(config.db, function(err) {
  if(err) {
    console.error('connect to %s failed.', config.db, err.message);
    process.exit(1);
  }
});

exports.FileModel = require('./FileModel');
