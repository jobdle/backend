import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ChatroomService } from './chatroom.service';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getroom(@Request() req, @Query('search') search: string) {
    return await this.chatroomService.getroom(req.user, search);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/lastmessage')
  async getLastMessage(@Query('roomId') roomId: string) {
    return await this.chatroomService.lastMessage(roomId);
  }
}
