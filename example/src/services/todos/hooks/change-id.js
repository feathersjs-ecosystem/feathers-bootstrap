module.exports = function () {
  return function (hook) {
    hook.id = hook.id + '?';
  };
};
