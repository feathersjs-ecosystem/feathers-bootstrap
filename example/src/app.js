const feathers = require('feathers');
const path = require('path');
const bootstrap = require('../../lib');

const app = feathers()
  .configure(bootstrap(path.join(__dirname, 'feathers.json')));

module.exports = app;
