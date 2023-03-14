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
    try {
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
    } catch (e) {
      console.log('Error at validateUser function in auth.service');
      console.log(e);
      throw e;
    }
  }

  async login(user: any): Promise<ResponseToken> {
    try {
      const payload = await {
        email: user.email,
        sub: user._id,
        role: user.role,
        fullname: user.fullname,
      };
      return await {
        accessToken: this.jwtService.sign(payload),
      };
    } catch (e) {
      console.log('Error at login function in auth.service');
      console.log(e);
      throw e;
    }
  }

  async verifyEmail(user: any): Promise<ResponseMessage> {
    try {
      console.log(user);
      const userId = await user.userId;
      const body = await { verifyEmail: 1 };
      await this.userService.updateOneUserData(userId, body);
      this.chatroomService.newroom(await user.userId, await user.fullname);
      return { message: 'verify email successfully.' };
    } catch (e) {
      console.log('Error at verifyEmail function in auth.service');
      console.log(e);
      throw e;
    }
  }

  async resendVerifyEmail(email: string): Promise<ResponseMessage> {
    try {
      return await this.userService.checkUserVerifyEmailAndSend(email);
    } catch (e) {
      console.log('Error at resendVerifyEmaill function in auth.service');
      console.log(e);
      throw e;
    }
  }

  async sendEmailToChancePassword(email: string): Promise<ResponseMessage> {
    try {
      const user = await this.userService.findByEmail(email);
      if (user) {
        const check = await user.verifyEmail;
        if (check) {
          return await this.mailService.sendVerifyEmailToChancePassword(user);
        } else {
          throw new BadRequestException(
            'This account is not verify email. Please verify before reset password.',
          );
        }
      } else {
        throw new BadRequestException('no account create by this email');
      }
    } catch (e) {
      console.log(
        'Error at sendEmailToChancePassword function in auth.service',
      );
      console.log(e);
      throw e;
    }
  }
}
