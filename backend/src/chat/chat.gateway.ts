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

  // Message handler for sending messages to specific rooms
  @SubscribeMessage('send_message') // Listens for 'send_message' event
  handleMessage(
    @MessageBody() data: { roomId: string; message: string }, // Accepts a roomId and message
    @ConnectedSocket() client: Socket
  ): void {
    console.log(`Message received in room ${data.roomId}: ${data.message} from ${client.id}`);
    
    // Broadcast the message to the specified room
    client.to(data.roomId).emit('receive_message', {
      sender: client.id,
      message: data.message,
      roomId: data.roomId,
    });
  }

  // Handler for joining a room
  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.join(data.roomId);
    console.log(`Client ${client.id} joined room ${data.roomId}`);
    client.emit('room_joined', { roomId: data.roomId });
  }

  // Handler for leaving a room
  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.leave(data.roomId);
    console.log(`Client ${client.id} left room ${data.roomId}`);
    client.emit('room_left', { roomId: data.roomId });
  }
  
}
