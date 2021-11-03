const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const server_config = require("../config").serverConfig;
const getIPAdress = require("../utils/IPUtils");

//读取密钥和签名证书
const options = {
  key: fs.readFileSync(server_config.server_key),
  cert: fs.readFileSync(server_config.server_crt),
}

const server = https.createServer(options);

server.listen(server_config.SSL_PORT, () => {
  console.log(`signal server running success at https://${getIPAdress()}:${server_config.SSL_PORT}`);
});

const io = socketIO.listen(server);

// socket监听连接
io.sockets.on('connection', (socket) => {
  console.log('连接建立');
  // 创建/加入房间
  socket.on('createAndJoinRoom', (message) => {
    const { room } = message;
    console.log('Received createAndJoinRoom：' + room);
    // 判断room是否存在
    const clientsInRoom = io.sockets.adapter.rooms[room];
    const numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    console.log('Room ' + room + ' now has ' + numClients + ' client(s)');
    if (numClients === 0) {
      // room 不存在 不存在则创建（socket.join）
      // 加入并创建房间
      socket.join(room);
      console.log('Client ID ' + socket.id + ' created room ' + room);

      // 发送消息至客户端 [id,room,peers]
      const data = {
        id: socket.id, //socket id
        room: room, // 房间号
        peers: [], // 其他连接
      };
      socket.emit('created', data);
    } else {
      // room 存在
      // 加入房间中
      socket.join(room);
      console.log('Client ID ' + socket.id + ' joined room ' + room);

      // joined告知房间里的其他客户端 [id,room]
      io.sockets.in(room).emit('joined', {
        id: socket.id, //socket id
        room: room, // 房间号
      });


      // 发送消息至客户端 [id,room,peers]
      const data = {
        id: socket.id, //socket id
        room: room, // 房间号
        peers: [], // 其他连接
      };
      // 查询其他连接
      const otherSocketIds = Object.keys(clientsInRoom.sockets);
      for (let i = 0; i < otherSocketIds.length; i++) {
        if (otherSocketIds[i] !== socket.id) {
          data.peers.push({
            id: otherSocketIds[i],
          });
        }
      }
      socket.emit('created', data);
    }
  });

  // 退出房间，转发exit消息至room其他客户端 [from,room]
  socket.on('exit', (message) => {
    console.log('Received exit: ' + message.from + ' message: ' + JSON.stringify(message));
    const { room } = message;
    // 关闭该连接
    socket.leave(room);
    // 转发exit消息至room其他客户端
    const clientsInRoom = io.sockets.adapter.rooms[room];
    if (clientsInRoom) {
      const otherSocketIds = Object.keys(clientsInRoom.sockets);
      for (let i = 0; i < otherSocketIds.length; i++) {
        const otherSocket = io.sockets.connected[otherSocketIds[i]];
        otherSocket.emit('exit', message);
      }
    }
  });

  // socket关闭
  socket.on('disconnect', function (reason) {
    const socketId = socket.id;
    console.log('disconnect: ' + socketId + ' reason:' + reason);
    const message = {
      from: socketId,
      room: '',
    };
    socket.broadcast.emit('exit', message);
  });

  // 转发offer消息至room其他客户端 [from,to,room,sdp]
  socket.on('offer', (message) => {
    // const room = Object.keys(socket.rooms)[1];
    console.log('收到offer: from ' + message.from + ' room:' + message.room + ' to ' + message.to);
    // 根据id找到对应连接
    const otherClient = io.sockets.connected[message.to];
    if (!otherClient) {
      return;
    }
    // 转发offer消息至其他客户端
    otherClient.emit('offer', message);
  });

  // 转发answer消息至room其他客户端 [from,to,room,sdp]
  socket.on('answer', (message) => {
    // const room = Object.keys(socket.rooms)[1];
    console.log('收到answer: from ' + message.from + ' room:' + message.room + ' to ' + message.to);
    // 根据id找到对应连接
    const otherClient = io.sockets.connected[message.to];
    if (!otherClient) {
      return;
    }
    // 转发answer消息至其他客户端
    otherClient.emit('answer', message);
  });

  // 转发candidate消息至room其他客户端 [from,to,room,candidate[sdpMid,sdpMLineIndex,sdp]]
  socket.on('candidate', (message) => {
    console.log('收到candidate: from ' + message.from + ' room:' + message.room + ' to ' + message.to);
    // 根据id找到对应连接
    const otherClient = io.sockets.connected[message.to];
    if (!otherClient) {
      return;
    }
    // 转发candidate消息至其他客户端
    otherClient.emit('candidate', message);
  });

});

module.exports = {}