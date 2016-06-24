module.exports = function(io) {
  io.on('connection', socket => {
    console.log('Got connection', socket);
  });
};
