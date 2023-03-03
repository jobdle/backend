import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatGateWayService } from 'src/chatGateWay/chatGateWay.service';
import { MessageDto, MessageForDataDto } from 'src/model/dto/chatroom.dto';
import { ResponseMessage } from 'src/model/response';
import { Chatroom } from 'src/model/schema/chatroom.schema';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel('Chatroom') private readonly chatroomModel: Model<Chatroom>,
  ) {}

  async findByUserId(userId: string) {
    return await this.chatroomModel.findOne({ userId: userId });
  }

  async getroom(user: any, search: string) {
    //return await this.chatroomModel.find();
    if (user.role == 'admin') {
      const filter = {};
      if (!!search) {
        search = search.trim();
        filter['$or'] = [{ fullname: { $regex: search, $options: 'i' } }];
      }
      return await this.chatroomModel.find(filter).sort({
        updatedAt: 'desc',
      });
    }
    return await this.chatroomModel.findOne({ userId: user.userId });
  }

  async newroom(userId: string, fullname: string): Promise<void> {
    console.log(userId);
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
      console.log('Create Newroom Success');
    }
  }

  async addMessage(body: MessageForDataDto): Promise<ResponseMessage> {
    console.log(body);
    const message: MessageDto = await {
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
        { $push: { messages: message }, lastIndexMessage: lastIndexMessage },
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

  async updateUserFullname(userId: string, fullname: string) {
    await this.chatroomModel.updateOne(
      { userId: userId },
      { nameOfUser: fullname },
      { timestamps: false },
    );
  }
}
