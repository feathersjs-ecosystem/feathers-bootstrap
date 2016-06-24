module.exports = function(options) {
  return new Promise(resolve =>
    setTimeout(() => resolve(`${options.test} ${options.other}`), 100)
  );
};
