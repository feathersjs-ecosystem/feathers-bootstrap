const feathers = require('feathers');
const path = require('path');
const bootstrap = require('../../lib');

const app = feathers().configure(bootstrap({
  main: path.join(__dirname, 'feathers.json')
}));

module.exports = app;
