import { Module } from '@nestjs/common';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { ChatGateWayController } from './chatGateWay.controller';
import { ChatGateWayService } from './chatGateWay.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [ChatroomModule],
  controllers: [ChatGateWayController],
  providers: [ChatGateWayService],
  exports: [ChatGateWayService],
})
export class ChatGateWayModule {}
