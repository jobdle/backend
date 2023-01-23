import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { UserDto } from 'src/model/dto/user.dto';
import { ResponseMessage, ResponseToken } from 'src/model/response';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

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
    console.log(0);
    return await this.userService.createUserAccount(data);
  }
}
