import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
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
