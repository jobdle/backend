import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatroomService } from './chatroom/chatroom.service';
import { MessageForData } from './model/chatroom';

@WebSocketGateway({ cors: { credentials: true } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server;

  constructor(private readonly chatroomService: ChatroomService) {}

  private logger = new Logger('ChatGateway');

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    messageContent: {
      roomId: string;
      content: {
        sender: string;
        senderID: string;
        content_type: string;
        content: string;
        timeStamp: Date;
      };
    },
  ) {
    console.log('SEND DATA SUCCESS : ' + messageContent.content.content);
    this.server.to(messageContent.roomId).emit('message', messageContent);
    const body: MessageForData = await {
      roomId: messageContent.roomId,
      senderId: messageContent.content.sender,
      content_type: messageContent.content.content_type,
      content: messageContent.content.content,
      timeStamp: messageContent.content.timeStamp,
    };
    console.log('111111');
    console.log(messageContent.roomId);
    console.log(messageContent);
    await this.chatroomService.addMessage(body);
  }

  @SubscribeMessage('joinroom')
  async JoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    console.log('JOINROOM :' + roomId);
    //this.server.emit('joinroom', room);
  }

  handleConnection() {
    console.log('client connect');
  }

  handleDisconnect() {
    console.log('client disconnect');
  }
}
