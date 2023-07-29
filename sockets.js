let readyPlayerCount = 0;

function listen(io) {
  // note 對channel進行Namespace後可以擁有相同的instance可使用
  const pongNamespace = io.of('/pong');

  pongNamespace.on('connection', (socket) => {
    let room;

    // note 所有players連線會顯示
    console.log('a user connected', socket.id);

    // note 當有player連線時，將readyPlayerCount+1
    socket.on('ready', () => {
      // set room number
      room = 'room' + Math.floor(readyPlayerCount / 2);
      socket.join(room);

      console.log('Player ready', socket.id, room);

      readyPlayerCount++;

      // note 湊到兩個的話就開始發送startGame的訊號給script.js
      if (readyPlayerCount % 2 === 0) {
        // broadcast('startGame')
        pongNamespace.in(room).emit('startGame', socket.id);
      }
    });

    // Paddle synchronization 
    socket.on('paddleMove', (paddleData) => {
      // note 使用to(room)來將訊息給此房間的client，除了發送者之外
      socket.to(room).emit('paddleMove', paddleData);
    });

    // Ball synchronization
    socket.on('ballMove', (ballData) => {
      socket.to(room).emit('ballMove', ballData);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
      socket.leave(room);
    });
  });
}

module.exports = {
  listen
};