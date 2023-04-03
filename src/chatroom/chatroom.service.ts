import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDto, MessageForDataDto } from 'src/model/dto/chatroom.dto';
import { ResponseMessage } from 'src/model/response';
import { Chatroom } from 'src/model/schema/chatroom.schema';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel('Chatroom') private readonly chatroomModel: Model<Chatroom>,
  ) {}

  async findByUserId(userId: string) {
    try {
      return await this.chatroomModel.findOne({ userId: userId });
    } catch (e) {
      console.log('Error at findByUserId function in chatroom.service');
      console.log(e);
      throw e;
    }
  }

  async getroom(user: any, search: string) {
    try {
      if (user.role == 'admin') {
        const filter = {};
        if (!!search) {
          filter['$or'] = await [
            { nameOfUser: { $regex: search, $options: 'i' } },
          ];
          return await this.chatroomModel.find(filter).sort({
            updatedAt: 'desc',
          });
        } else {
          return await this.chatroomModel.find(filter).sort({
            updatedAt: 'desc',
          });
        }
      }
      return await this.chatroomModel.findOne({ userId: user.userId });
    } catch (e) {
      console.log('Error at getroom function in chatroom.service');
      console.log(e);
      throw e;
    }
  }

  async newroom(userId: string, fullname: string): Promise<void> {
    try {
      const checkroom = await this.chatroomModel.findOne({
        userId: userId,
      });
      if (!checkroom) {
        const newRoom = await new this.chatroomModel({
          nameOfUser: fullname,
          userId: userId,
          messages: [],
          idxMessage: 0,
        });
        newRoom.save();
      }
    } catch (e) {
      console.log('Error at newroom function in chatroom.service');
      console.log(e);
      throw e;
    }
  }

  async addMessage(body: MessageForDataDto): Promise<ResponseMessage> {
    const message: MessageDto = await {
      senderId: body.senderId,
      content_type: body.content_type,
      content: body.content,
      timeStamp: new Date(),
    };
    try {
      const checkroom = await this.chatroomModel.findOne({ _id: body.roomId });
      if (checkroom) {
        const lastIndexMessage = await checkroom.messages.length;
        await this.chatroomModel.updateOne(
          { _id: body.roomId },
          { $push: { messages: message }, lastIndexMessage: lastIndexMessage },
        );
        return { message: 'New message Succes' };
      }
      throw new BadRequestException('This roomId is not find.');
    } catch (e) {
      console.log('Error at addMessage function in chatroom.service');
      console.log(e);
      throw e;
    }
  }

  async lastMessage(roomId: string) {
    try {
      const chatroom = await this.chatroomModel.findOne({ _id: roomId });
      if (!chatroom) return [];
      const idx = await chatroom.messages.length;
      if (idx == 0) {
        return [];
      } else {
        return await chatroom.messages[idx - 1];
      }
    } catch (e) {
      console.log('Error at lastMessage function in chatroom.service');
      console.log(e);
      throw e;
    }
  }

  async updateUserFullname(userId: string, fullname: string) {
    try {
      await this.chatroomModel.updateOne(
        { userId: userId },
        { nameOfUser: fullname },
        { timestamps: false },
      );
    } catch (e) {
      console.log('Error at updateUserFullname function in chatroom.service');
      console.log(e);
      throw e;
    }
  }
}
