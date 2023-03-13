import {
  Controller,
  Get,
  UseGuards,
  Request,
  Body,
  Patch,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { changePasswordDto } from 'src/model/dto/user.dto';
import { ResponseMessage } from 'src/model/response';
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
  @Get(':id')
  async getUser(@Request() req, @Query() id: string): Promise<any> {
    return await this.userService.getOneUserData(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Request() req): Promise<any> {
    return await this.userService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() body: any,
  ): Promise<ResponseMessage> {
    return await this.userService.updateOneUserData(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async changePassword(
    @Request() req,
    @Body() body: changePasswordDto,
  ): Promise<ResponseMessage> {
    return await this.userService.changePassword(req.user.userId, body);
  }
}
