const net = require('net'); 

class Client {
  constructor(port = 6969, address = '127.0.0.1') { 
    this.socket = new net.Socket(); 
    this.address = address; 
    this.port = port; 
    this.init(); 
  } 

  init() { 
    this.socket.connect(this.port, this.address, () => { 
      console.log(`Client connected to: ${this.address}:${this.port}`); 
    }); 
    this.socket.on('close', () => { 
      console.log('Client closed'); 
    }); 
    this.socket.on('data', data => {     
      console.log(`Sever: ${data}`); 
    });
    this.socket.on('error', error => {
      console.error(`Error: ${error.message}`);
    });
  } 

  sendData(data) { 
    this.socket.write(data); 
  } 

  disconnect() {
    this.socket.end();
  }
} 

module.exports = Client;
