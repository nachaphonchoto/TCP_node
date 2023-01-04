const net = require('net');

const HOST = '127.0.0.1';
const PORT = 6969;

const server = net.createServer();

server.on('listening', () => {
  console.log(`TCP server listening on ${HOST}:${PORT}`);
});

server.listen(PORT, HOST);

const sockets = [];

server.on('connection', (socket) => {
  try {
    var clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`new client connected: ${clientAddress}`);
  } catch (err) {
    console.error(`Error occurred while getting client address: ${err.message}`);
  }

  socket.on('data', (data) => {
    sockets.forEach((sock) => {
      sock.socket.write(`${data} connected!`);
    });
    sockets.push({socket: socket, data: data});
  });

  socket.on('close', () => {
    var name;

    var index = sockets.findIndex((o) => {
        if (
            o.socket.remoteAddress === socket.remoteAddress &&
            o.socket.remotePort === socket.remotePort
        ) {
            name = o.data;
        }
      return (
        o.socket.remoteAddress === socket.remoteAddress &&
        o.socket.remotePort === socket.remotePort
      );
    });

    if (index !== -1) {
      sockets.splice(index, 1);
      sockets.forEach((sock) => {
        sock.socket.write(`${name} disconnected ;-;`);
      });
    }

    console.log(`connection closed: ${clientAddress}`);
  });

  socket.on('error', (err) => {
    console.log(`Error occurred in ${clientAddress}: ${err.message}`);
  });
});
