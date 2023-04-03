import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { MessageForDataDto } from 'src/model/dto/chatroom.dto';

@WebSocketGateway({ cors: { credentials: true } })
export class ChatGateWayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
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
        senderId: string;
        content_type: string;
        content: string;
        timeStamp: Date;
      };
    },
  ) {
    try {
      await this.updateWorkMessage(messageContent);
    } catch (e) {
      console.log('Error at handleMessage function in chatGateWay.service');
      console.log(e);
      throw e;
    }
  }

  async updateWorkMessage(messageContent: {
    roomId: string;
    content: {
      sender: string;
      senderId: string;
      content_type: string;
      content: string;
      timeStamp: Date;
    };
  }) {
    try {
      this.server.to(messageContent.roomId).emit('message', messageContent);
      const body: MessageForDataDto = await {
        roomId: messageContent.roomId,
        senderId: messageContent.content.senderId,
        content_type: messageContent.content.content_type,
        content: messageContent.content.content,
        timeStamp: messageContent.content.timeStamp,
      };
      await this.chatroomService.addMessage(body);
    } catch (e) {
      console.log('Error at updateWorkMessage function in chatGateWay.service');
      console.log(e);
      throw e;
    }
  }

  @SubscribeMessage('joinroom')
  async JoinRoom(client: Socket, roomId: string) {
    try {
      client.join(roomId);
    } catch (e) {
      console.log('Error at SubscribeMessage function in chatGateWay.service');
      console.log(e);
      throw e;
    }
  }

  handleConnection() {
    console.log('client connect');
  }

  handleDisconnect() {
    console.log('client disconnect');
  }
}
