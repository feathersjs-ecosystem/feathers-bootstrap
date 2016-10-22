class Service {
  constructor (options) {
    this.options = options;
  }

  get (id) {
    return Promise.resolve({
      id, text: `You really have to do ${id}!`
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};
