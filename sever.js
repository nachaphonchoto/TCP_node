const net = require('net');

const HOST = '127.0.0.1';
const PORT = 6969;

const server = net.createServer();

server.on('listening', () => {
  console.log(`TCP server listening on ${HOST}:${PORT}`);
});

server.listen(PORT, HOST);

const sockets = [];
const connected = [];

server.on('connection', (socket) => {
  try {
    var clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`new client connected: ${clientAddress}`);
  } catch (err) {
    console.error(`Error occurred while getting client address: ${err.message}`);
  }

  socket.on('data', (data) => {
    sockets.forEach((sock) => {
      sock.write(`${data} connected!`);
    });
    sockets.push(socket);
    connected.push({
      address: socket.remoteAddress,
      port: socket.remotePort,
      data: data,
    });
  });

  socket.on('close', () => {
    var name;

    var index = sockets.findIndex((o) => {
      return (
        o.remoteAddress === socket.remoteAddress &&
        o.remotePort === socket.remotePort
      );
    });

    var temp = connected.findIndex((o) => {
      if (
        o.address === socket.remoteAddress &&
        o.port === socket.remotePort
      ) {
        name = o.data;
      }
      return (
        o.address === socket.remoteAddress && o.port === socket.remotePort
      );
    });

    if (index !== -1) {
      sockets.splice(index, 1);
      sockets.forEach((sock) => {
        sock.write(`${name} disconnected\n`);
      });
    }
    if (temp !== -1) connected.splice(temp, 1);

    console.log(`connection closed: ${clientAddress}`);
  });

  socket.on('error', (err) => {
    console.log(`Error occurred in ${clientAddress}: ${err.message}`);
  });
});
