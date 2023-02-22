import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Query,
  Get,
} from '@nestjs/common';
import { Patch } from '@nestjs/common/decorators';
import { UserDto } from 'src/model/dto/user.dto';
import { ResponseMessage, ResponseToken } from 'src/model/response';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { VerifyEmailGuard } from './guard/verifyEmail.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req): Promise<ResponseToken> {
    return await this.authService.login(req.user);
  }

  @Post('signup')
  async signUp(@Body() data: UserDto): Promise<ResponseMessage> {
    return await this.userService.createUserAccount(data);
  }

  @UseGuards(VerifyEmailGuard)
  @Post('verify')
  async verifyEmail(@Request() req): Promise<ResponseMessage> {
    console.log(2);
    console.log(req.user);
    return await this.authService.verifyEmail(req.user);
  }

  @Get('verify')
  async resendVerifyEmail(
    @Query('email') email: string,
  ): Promise<ResponseMessage> {
    return await this.authService.resendVerifyEmail(email);
  }

  @Get('password')
  async sendEmailToChancePassword(
    @Query('email') email: string,
  ): Promise<ResponseMessage> {
    return await this.authService.sendEmailToChancePassword(email);
  }

  @UseGuards(VerifyEmailGuard)
  @Patch('password')
  async reset(
    @Request() req,
    @Body() password: string,
  ): Promise<ResponseMessage> {
    return await this.userService.resetpassword(req.user, password);
  }
}
