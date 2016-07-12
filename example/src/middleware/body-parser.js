'use strict';

const bodyParser = require('body-parser');

module.exports = function(options) {
  const json = bodyParser.json();
  const urlencoded = bodyParser.urlencoded({
    extended: options.extended
  });

  return function(req, res, next) {
    json(req, res, function(error) {
      if(error) {
        return next(error);
      }

      urlencoded(req, res, next);
    });
  };
};
