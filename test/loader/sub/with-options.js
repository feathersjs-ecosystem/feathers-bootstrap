module.exports = function(options) {
  return new Promise(resolve =>
    setTimeout(() => resolve(options.path.join(options.test, options.other)), 100)
  );
};
