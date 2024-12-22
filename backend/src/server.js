const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 4000 });

server.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('message', (message) => {
    console.log('Message received:', message);
    socket.send(`Echo: ${message}`);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:4000');
