const serveStatic = require('feathers').static;
const compress = require('compression');
const bodyParser = require('body-parser');

module.exports = function(options) {
  return function() {
    const app = this;

    app.use(compress())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: true }));

    if(options) {
      app.use('/', serveStatic(options.public));
    }
  };
};
