import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../messages/message.service';

@WebSocketGateway(4000, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<string, { role: string; userId: string }>();

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    // Send chat history to the newly connected client
    this.messageService.getMessages().then((messages) => {
      client.emit('chat_history', messages);
    });

    this.server.emit('notification', {
      message: `A new user has joined the chat.`,
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const user = this.users.get(client.id);
    this.users.delete(client.id);

    this.server.emit('notification', {
      message: `${user?.role || 'A user'} has left the chat.`,
    });
  }

  @SubscribeMessage('register_role')
  handleRegisterRole(
    @MessageBody() data: { role: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Role registered: ${data.role} for client ${client.id}`);
    this.users.set(client.id, { role: data.role, userId: data.userId });
  }

  @SubscribeMessage('send_message')
async handleMessage(
  @MessageBody()
  data: { userId: string; recipientId?: string; content: string; role?: string },
  @ConnectedSocket() client: Socket,
) {
  console.log(`Message received from ${client.id}:`, data);

  // Map userId to senderId and save message to the database
  await this.messageService.saveMessage({
    senderId: data.userId,
    recipientId: data.recipientId,
    content: data.content,
  });

  if (data.recipientId) {
    // Private message
    const recipient = Array.from(this.server.sockets.sockets.values()).find(
      (socket) => this.users.get(socket.id)?.userId === data.recipientId,
    );
    if (recipient) {
      recipient.emit('receive_message', data);
    }
  } else if (data.role) {
    // Broadcast to a specific role
    this.server.sockets.sockets.forEach((socket) => {
      if (this.users.get(socket.id)?.role === data.role) {
        socket.emit('receive_message', data);
      }
    });
  } else {
    // Broadcast to everyone
    this.server.emit('receive_message', data);
  }

  return data;
}

}
