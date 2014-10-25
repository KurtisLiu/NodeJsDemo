var path = require('path');

var config = {
  uploadDir: path.join(__dirname, 'files'),
  db: 'mongodb://localhost/fmp'
};
module.exports = config;