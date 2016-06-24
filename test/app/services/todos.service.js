class Service {
  constructor(options) {
    this.options = options;
  }
}

module.exports = function(options) {
  return new Service(options);
};
