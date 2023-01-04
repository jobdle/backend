import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chatroom, MessageForData, Message } from 'src/model/chatroom';
import { ResponseMessage } from 'src/model/response';
import { User } from 'src/model/user.model';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel('Chatroom') private readonly chatroomModel: Model<Chatroom>,
  ) {}

  async getroom(user: any) {
    if (user.role == 'admin') {
      return await this.chatroomModel.find();
    }
    return await this.chatroomModel.findOne({ userId: user.userId });
  }

  async newroom(userId: string): Promise<void> {
    console.log(userId);
    const checkroom = await this.chatroomModel.findOne({
      userId: userId,
    });
    if (!checkroom) {
      const newRoom = await new this.chatroomModel({
        userId: userId,
        messages: [],
        idxMessage: 0,
      });
      newRoom.save();
      console.log('Create Newroom Success');
    }
  }

  async addMessage(body: MessageForData): Promise<ResponseMessage> {
    console.log(body);
    const message: Message = await {
      senderId: body.senderId,
      content_type: body.content_type,
      content: body.content,
      timeStamp: new Date(),
    };
    const checkroom = await this.chatroomModel.findOne({ _id: body.roomId });
    if (checkroom) {
      const lastIndexMessage = await checkroom.messages.length;
      await this.chatroomModel.updateOne(
        { _id: body.roomId },
        { $push: { messages: [message] }, lastIndexMessage: lastIndexMessage },
      );
      console.log('New message Succes');
      return { message: 'New message Succes' };
    }
    throw new BadRequestException('This roomId is not find.');
  }

  async lastMessage(roomId: string) {
    const chatroom = await this.chatroomModel.findOne({ _id: roomId });
    if (!chatroom) return [];
    const idx = await chatroom.messages.length;
    if (idx == 0) {
      return [];
    } else {
      return await chatroom.messages[idx - 1];
    }
  }
}