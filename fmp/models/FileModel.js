var mongoose = require('mongoose');

var FileSchame = new mongoose.Schema({
  real_name: {type: String},
  uuid_name: {type: String},
  owner: {type: String}
});

var FileModel = mongoose.model('files', FileSchame);
module.exports = FileModel;