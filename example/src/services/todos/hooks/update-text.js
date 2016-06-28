module.exports = function() {
  return function(hook) {
    hook.result.text = hook.result.text + ' (updated from hook)';
  };
};
