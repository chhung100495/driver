var haversineDistance = require('./fn/haversineDistance').calculate;
var constants = require('./constants');

var webSocket = require('ws');

var SOCKET_PORT = process.env.SOCKET_PORT || 40511
var socketServer;
var clients = [];

if (!socketServer) {
  socketServer = new webSocket.Server({
      port: SOCKET_PORT
  });

  socketServer.on('connection', clientSocket => {

    console.log('A new client connected');

    clients.push({
      socket: clientSocket
    });

    clientSocket.on('message', msg => {
      var driverInfo = JSON.parse(msg);
      console.log(`[DRIVER INFO]: id: ${driverInfo.id}, lat: ${driverInfo.lat}, lng: ${driverInfo.lng}, status: ${driverInfo.status}`);
      for (var c of clients) {
        if (c.socket == clientSocket) {
          c.id = driverInfo.id;
          c.lat = driverInfo.lat;
          c.lng = driverInfo.lng;
          c.status = driverInfo.status;
          break;
        }
      };
    })
  })

  console.log(`WebSocket is running on port ${SOCKET_PORT}`)
}

var hasRejected = (obj, client) => {
  for (var id of obj.ids) {
    if (client.id === id) {
      return true;
    }
  }
  return false;
}

var changeStatus = (id, status) => {
  for (var i = 0; i <= clients.length-1; i++) {
    if (clients[i].id === id) {
      clients[i].status = status;
    }
  }
}

var hasAnyDriverActivation = obj => {
  if (!Array.isArray(clients) || !clients.length) {
    return false;
  }
  var count = 0;
  for (var c of clients) {
    // check this client id is existed in list of ids reject
    var rejected = false;
    if (obj.n > 0) {
      rejected = hasRejected(obj, c);
    }
    if (c.socket.readyState === webSocket.OPEN && c.status === constants.status.online && rejected === false) {
      count++;
    }
  }
  if (count === 0) {
    return false;
  }
  return true;
}

var sendToNearestClient = obj => {
  var nestestDistance;
  var nestestClient;
  for (var c of clients) {
    // check this client id is existed in list of ids reject
    var rejected = false;
    if (obj.n > 0) {
      rejected = hasRejected(obj, c);
    }
    if (c.socket.readyState === webSocket.OPEN && c.status === constants.status.online && rejected === false) {
      nestestDistance = haversineDistance(obj.Latitude, obj.Longtitude, c.lat, c.lng);
      nestestClient = c;
      break;
    }
  };
  for (var c of clients) {
    // check this client id is existed in list of ids reject
    var rejected = false;
    if (obj.n > 0) {
      rejected = hasRejected(obj, c);
    }
    if (c.socket.readyState === webSocket.OPEN && c.status === constants.status.online && rejected === false) {
      var distance = haversineDistance(obj.Latitude, obj.Longtitude, c.lat, c.lng);
      if (distance < nestestDistance) {
        nestestDistance = distance;
        nestestClient = c;
      }
    }
  };
  // change status of client has been chosen to serve to 'busy'
  for (var i = 0; i <= clients.length-1; i++) {
    if (clients[i] === nestestClient) {
      clients[i].status = constants.status.busy;
    }
  }
  obj.distance = Number(haversineDistance(obj.Latitude, obj.Longtitude, obj.FinishLatitude, obj.FinishLongtitude).toFixed(2));
  obj.n = obj.n + 1;
  // driver has been chosen to serve this time
  obj.driver = nestestClient.id;
  // list of ids has been chosen to serve this request
  obj.ids.push(nestestClient.id);
  nestestClient.socket.send(JSON.stringify(obj));
}

var broadcastAll = obj => {
  for (var c of clients) {
    if (c.socket.readyState === webSocket.OPEN) {
      c.socket.send(JSON.stringify(obj));
    }
  }
}

module.exports = {
  socketServer,
  broadcastAll,
  sendToNearestClient,
  hasAnyDriverActivation,
  changeStatus
}
