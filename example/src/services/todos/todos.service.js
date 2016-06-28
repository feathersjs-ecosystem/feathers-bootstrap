class Service {
  constructor(options) {
    this.options = options;
  }

  get(id) {
    return Promise.resolve({
      id, text: `${this.options.todos.text} ${id}!`
    });
  }
}

module.exports = function(options) {
  return new Service(options);
};
