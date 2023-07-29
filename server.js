const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = 3000;

server.listen(PORT);
console.log(`Server listening on port ${PORT}`);

let readyPlayerCount = 0;

io.on('connection', (socket) => {
  // note 所有players連線會顯示
  console.log('a user connected', socket.id);

  // note 當有player連線時，將readyPlayerCount+1
  socket.on('ready', () => {
    console.log('Player ready', socket.id);

    readyPlayerCount++;

    // note 湊到兩個的話就開始發送startGame的訊號給script.js
    if (readyPlayerCount === 2) {
      // broadcast('startGame')
      io.emit('startGame', socket.id);
    }
  });

  socket.on('paddleMove', (paddleData) => {
    // note socket.broadcast.emit()是送出訊息給全部的client，除了發送者之外
    socket.broadcast.emit('paddleMove', paddleData);
  });

  socket.on('ballMove', (ballData) => {
    socket.broadcast.emit('ballMove', ballData);

  });
});