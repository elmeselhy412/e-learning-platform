import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private rooms: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.leaveAllRooms(client);
  }

  // Join a specific room
  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)?.add(client.id);
    client.join(roomId);
    client.emit('joined_room', { roomId });
    client.to(roomId).emit('user_joined', { userId: client.id, roomId });
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  // Leave a specific room
  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;
    this.rooms.get(roomId)?.delete(client.id);
    client.leave(roomId);
    client.emit('left_room', { roomId });
    client.to(roomId).emit('user_left', { userId: client.id, roomId });
    console.log(`Client ${client.id} left room ${roomId}`);
  }

  // Send notifications for replies or updates
  @SubscribeMessage('send_message')
  handleMessage(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId, message } = data;
    console.log(
      `Message received in room ${roomId}: ${message} from ${client.id}`,
    );
    client.to(roomId).emit('new_message', { userId: client.id, message });
  }

  // Helper to leave all rooms when a user disconnects
  private leaveAllRooms(client: Socket) {
    for (const [roomId, participants] of this.rooms.entries()) {
      if (participants.has(client.id)) {
        participants.delete(client.id);
        client.to(roomId).emit('user_left', { userId: client.id, roomId });
        console.log(`Client ${client.id} left room ${roomId}`);
      }
    }
  }
}
