const net = require('net');
const readline = require('readline');

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
      console.log('Client disconnected');
    }); 
    this.socket.on('data', data => {     
      console.log(`Server: ${data}`); 
    });
    this.socket.on('error', error => {
      console.error(`Error: ${error.message}`);
    });

    // Add CLI
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.rl.on('line', (input) => {
      if (input.trim() === 'disconnect') {
        this.disconnect();
        this.rl.close();
      } else {
        console.log('If you want to disconnect use this command : disconnect')
      }
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