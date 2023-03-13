import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ResponseMessage, ResponseToken } from 'src/model/response';
import { UserDto } from 'src/model/dto/user.dto';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { BadRequestException } from '@nestjs/common/exceptions';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly chatroomService: ChatroomService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      if (!user.verifyEmail) {
        throw new BadRequestException('please verify account in your email.');
      }
      return user;
    }
    return null;
  }

  async login(user: any): Promise<ResponseToken> {
    const payload = await {
      email: user.email,
      sub: user._id,
      role: user.role,
      fullname: user.fullname,
    };
    return await {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async verifyEmail(user: any): Promise<ResponseMessage> {
    console.log(user);
    const userId = await user.userId;
    const body = await { verifyEmail: 1 };
    await this.userService.updateOneUserData(userId, body);
    this.chatroomService.newroom(await user.userId, await user.fullname);
    return { message: 'verify email successfully.' };
  }

  async resendVerifyEmail(email: string): Promise<ResponseMessage> {
    return await this.userService.checkUserVerifyEmailAndSend(email);
  }

  async sendEmailToChancePassword(email: string): Promise<ResponseMessage> {
    const user = await this.userService.findByEmail(email);
    const check = await user.verifyEmail;
    if (check) {
      return await this.mailService.sendVerifyEmailToChancePassword(user);
    } else {
      return {
        message:
          'This account is not verify email. Please verify before reset password.',
      };
    }
  }
}
