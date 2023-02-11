import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ChatroomService } from './chatroom.service';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  // @UseGuards(JwtAuthGuard)
  // @Post('/newroom')
  // async newroom(@Body('userId') userId: string) {
  //   await this.chatroomService.newroom(userId);
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getroom(@Request() req) {
    return await this.chatroomService.getroom(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async newmessage(@Body() body: any) {
    await this.chatroomService.addMessage(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/lastmessage')
  async getLastMessage(@Query('roomId') roomId: string) {
    return await this.chatroomService.lastMessage(roomId);
  }
}
