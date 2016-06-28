const path = require('path');
const NeDB = require('nedb');

module.exports = function(options) {
  return new NeDB({
    filename: path.join(options.path, 'messages.db'),
    autoload: true
  });
};
