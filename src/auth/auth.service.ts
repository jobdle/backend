import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ResponseMessage, ResponseToken } from 'src/model/response';
import { UserDto } from 'src/model/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserDto> {
    const user = await this.userService.findOne(username);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }
    return null;
  }

  async login(user: any): Promise<ResponseToken> {
    console.log(user);
    const payload = await {
      username: user.username,
      sub: user._id,
      role: user.role,
      fullname: await ((await user.firstname) + ' ' + (await user.lastname)),
    };
    console.log(payload);
    return await {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async verifyEmail(user: any): Promise<ResponseMessage> {
    const userId = await user.userId;
    const body = await { verifyEmail: 1 };
    await this.userService.updateOneUserData(userId, body);
    return { message: 'verify email successfully.' };
  }
}
