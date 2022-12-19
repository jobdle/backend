import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'aaaaaaaa';
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    }
    return null;
  }

  async login(user: any): Promise<any> {
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
}
