import {
  Controller,
  Get,
  UseGuards,
  Request,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDto } from 'src/model/dto/user.dto';
import { ResponseMessage } from 'src/model/response';
import { User } from 'src/model/schema/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<any> {
    return await this.userService.getOneUserData(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() body: any,
  ): Promise<ResponseMessage> {
    return await this.userService.updateOneUserData(req.user.userId, body);
  }
}
