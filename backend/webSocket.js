var webSocket = require('ws');

var SOCKET_PORT = process.env.SOCKET_PORT || 40511
var socketServer;

if (!socketServer) {
  socketServer = new webSocket.Server({
      port: SOCKET_PORT
  });

  socketServer.on('connection', clientSocket => {

    console.log('A new client connected')

    clientSocket.on('message', msg => {
      console.log(`received: ${msg}`)
    })
  })

  console.log(`WebSocket is running on port ${SOCKET_PORT}`)
}

var broadcastAll = obj => {
  for (var c of socketServer.clients) {
    if (c.readyState === webSocket.OPEN) {
      c.send(JSON.stringify(obj))
    }
  }
}

module.exports = {
  socketServer,
  broadcastAll
}
