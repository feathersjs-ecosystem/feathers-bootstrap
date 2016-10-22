module.exports = function () {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('You are using the default filter for the `todos` service (in `src/services/todos/todos.filter.js`). This means all clients will get every real-time event. For more information how to filter events see http://docs.feathersjs.com/real-time/filtering.html');
  }

  return function () {
    return true;
  };
};
