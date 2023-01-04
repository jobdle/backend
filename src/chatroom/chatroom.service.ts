import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chatroom, MessageForData, Message } from 'src/model/chatroom';
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
      });
      newRoom.save();
      console.log('Create Newroom Success');
    }
  }

  async addMessage(body: MessageForData) {
    console.log(body);
    const message: Message = {
      sender: body.sender,
      content_type: body.content_type,
      content: body.content,
      timeStamp: body.timeStamp,
    };
    const checkroom = await this.chatroomModel.findOne({ userId: body.userId });
    if (checkroom) {
      await this.chatroomModel
        .updateOne({ userId: body.userId }, { $push: { messages: [message] } })
        .then(() => {
          console.log('New message Succes');
        });
    }
  }

  async LastMessage(userId: string) {
    const chatroom = await this.chatroomModel.findOne({ userId: userId });
    if (!chatroom) return [];
    const idx = chatroom.messages.length;
    if (idx == 0) {
      return [];
    } else {
      const data = chatroom.messages[idx - 1];
      return data;
    }
  }
}
