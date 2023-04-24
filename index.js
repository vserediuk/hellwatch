const express = require("express");
const app = express();
const server = require("http").createServer(app);
const socketIO = require ('socket.io');

app.use(express.static(__dirname + "/public"));

const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 3001;
let videoSrc = 'http://localhost:3001/animevost_1-seriya-Berserk.mp4';
let currentTime = 0;

// обработчик события подключения нового клиента

io.on('connection', (socket) => {

  io.emit('updateSrc', videoSrc);
  io.emit('pause');
  io.emit('timeupdate', currentTime);

  socket.on('updateSrc', (src)=> {
    videoSrc = src;
    io.emit('updateSrc', videoSrc);
  });

  socket.on('play', ()=> {
    io.emit('play');
  });

  socket.on('pause', ()=> {
    io.emit('pause');
  });

  socket.on('stopPlay', ()=> {
    io.emit('resumePlay');
  });

  // обработчик события загрузки фрейма на клиенте
  socket.on('timeupdate', (time) => {
    currentTime = time;
    io.emit('timeupdate', time); // оповещаем всех клиентов о загрузке фрейма
  });
});

server.listen(PORT, function () {
  console.log('CORS-enabled web server listening on port ' + PORT);
});