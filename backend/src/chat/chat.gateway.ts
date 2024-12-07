import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway() // Decorator to mark this as a WebSocket gateway
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  // This method is triggered when a client connects
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // This method is triggered when a client disconnects
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Message handler for sending messages
  @SubscribeMessage('send_message') // Listens for 'send_message' event
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): void {
    console.log(`Received message: ${message} from ${client.id}`);
    
    // Broadcast the message to all connected clients except the sender
    client.broadcast.emit('receive_message', message); // 'receive_message' is the event sent to clients
  }
}
