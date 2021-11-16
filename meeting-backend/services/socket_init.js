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

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

function getRoomUser(room) {
  return io.sockets.adapter.rooms.get(room);
}


// 客户端socketID和本次所起的昵称的映射
let socket_name_map = {};
function insertSocketNameMap(socketID, name) {
  socket_name_map[socketID] = name;
}
function getSocketName(socketID) {
  if (socket_name_map.hasOwnProperty(socketID)) {
    return socket_name_map[socketID];
  }
}
function removeSocketName(socketID) {
  delete socket_name_map[socketID];
}

// socket监听连接
io.sockets.on('connection', (socket) => {
  console.log('连接建立');
  // 创建/加入房间
  socket.on('createAndJoinRoom', (message) => {
    const { room } = message;
    const { name } = message;
    // 记录每个用户的昵称
    insertSocketNameMap(socket.id, name);
    console.log('Received createAndJoinRoom：' + room);
    // 判断room是否存在
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    const numClients = clientsInRoom ? clientsInRoom.size : 0;
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
      // joined告知房间里的其他客户端 [id,room,name]
      // io.sockets.in(room).emit('joined', {
      //   id: socket.id, //socket id
      //   room: room, // 房间号
      //   name: name,
      // });

      // 发送消息至客户端 [id,room,peers]
      const data = {
        id: socket.id, //socket id
        room: room, // 房间号
        peers: [], // 其他连接
      };
      // 查询其他连接
      // const otherSocketIds = Object.keys(clientsInRoom);

      // for (let i = 0; i < otherSocketIds.length; i++) {
      //   if (otherSocketIds[i] !== socket.id) {
      //     data.peers.push({
      //       id: otherSocketIds[i],
      //     });
      //   }
      // }
      for (var x of clientsInRoom) {
        if (x !== socket.id) {
          data.peers.push({
            id: x,
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
    // 删除昵称
    removeSocketName(socket.id);
    // 转发exit消息至room其他客户端
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    if (clientsInRoom) {
      for (let otherSocketID of clientsInRoom) {
        const otherSocket = io.sockets.sockets.get(otherSocketID);
        otherSocket.emit('exit', message);
      }
    }
  });

  // 转发closeCamera消息至其他客户端 [from, room]
  socket.on('closeCamera', (message) => {
    console.log('Received closeCamera: ' + message.from + ' message: ' + JSON.stringify(message));
    const { room } = message;
    // 转发closeCamera消息至room其他客户端
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    if (clientsInRoom) {
      for (let otherSocketID of clientsInRoom) {
        const otherSocket = io.sockets.sockets.get(otherSocketID);
        otherSocket.emit('closeCamera', message);
      }
    }
  });

  // 转发openCamera消息至其他客户端 [from, room]
  socket.on('openCamera', (message) => {
    console.log('Received openCamera: ' + message.from + ' message: ' + JSON.stringify(message));
    const { room } = message;
    // 转发openCamera消息至room其他客户端
    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    if (clientsInRoom) {
      for (let otherSocketID of clientsInRoom) {
        const otherSocket = io.sockets.sockets.get(otherSocketID);
        otherSocket.emit('openCamera', message);
      }
    }
  });

  // socket关闭
  socket.on('disconnect', function (reason) {
    const socketId = socket.id;
    console.log('disconnect: ' + socketId + ' reason:' + reason);
    // 删除昵称
    removeSocketName(socket.id);
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
    const otherClient = io.sockets.sockets.get(message.to);
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
    const otherClient = io.sockets.sockets.get(message.to);
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
    const otherClient = io.sockets.sockets.get(message.to);
    if (!otherClient) {
      return;
    }
    // 转发candidate消息至其他客户端
    otherClient.emit('candidate', message);
  });

  // 获取房间内用户昵称 [from, room]
  socket.on("roomUserName", (message) => {
    console.log('收到roomUserName: ', message);
    const { room } = message;
    // 转发closeCamera消息至room其他客户端
    const clientsInRoom = getRoomUser(room);
    if (clientsInRoom) {
      for (let socketID of clientsInRoom) {
        nameMap[socketID] = getSocketName(socketID);
      }
    }
    const data = {
      nameMap: nameMap
    };
    socket.emit("roomUserName", data);
  });

  // 根据socketID获取昵称
  socket.on("getNameBySocketID", (message) => {
    const { socketID } = message;
    const data = {
      socketID: socketID,
      name: getSocketName(socketID)
    };

    socket.emit("getNameBySocketID", data);
  })

});

module.exports = {}