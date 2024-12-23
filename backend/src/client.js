const io = require('socket.io-client');
const readline = require('readline');

// Connect to the WebSocket server
const socket = io('http://localhost:4000', {
  transports: ['websocket'], // Enforce WebSocket transport
});

const role = process.argv[2] || 'student'; // Pass 'instructor' or 'student' as an argument
const userId = `user_${Math.random().toString(36).substring(7)}`; // Unique user ID

socket.on('connect', () => {
  console.log(`[${role}] Connected as ${userId}`);
  
  // Register role with the server
  socket.emit('register_role', { role, userId });

  // Prompt user for input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (input) => {
    const [recipientId, ...messageParts] = input.split(' ');
    const message = messageParts.join(' ');
    
    if (recipientId && message) {
      // Send a private message to a specific recipient
      socket.emit('send_message', {
        userId,
        recipientId,
        content: message,
      });
    } else {
      console.log('Usage: <recipientId> <message>');
    }
  });
});

socket.on('receive_message', (data) => {
  console.log(`[${role}] New message received from ${data.userId}: ${data.content}`);
});

socket.on('chat_history', (messages) => {
  console.log(`[${role}] Chat history:`);
  messages.forEach((msg) => {
    console.log(`${msg.senderId}: ${msg.content}`);
  });
});

socket.on('notification', (data) => {
  console.log(`[Notification]: ${data.message}`);
});

socket.on('disconnect', () => {
  console.log(`[${role}] Disconnected`);
});
