import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateWayModule } from 'src/chatGateWay/chatGateWay.module';
import { ChatroomSchema } from 'src/model/schema/chatroom.schema';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chatroom', schema: ChatroomSchema }]),
  ],
  controllers: [ChatroomController],
  providers: [ChatroomService],
  exports: [ChatroomService],
})
export class ChatroomModule {}
