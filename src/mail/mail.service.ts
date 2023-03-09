import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { ResponseMessage } from 'src/model/response';
import { User } from 'src/model/schema/user.schema';
//import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
  ) {} //ใส่authละแตกงงดี
  async sendVerifyEmail(
    email: string,
    fullname: string,
    id: string,
  ): Promise<ResponseMessage> {
    const token = await this.generateVerifyToken(id, fullname);
    const url = await (process.env.PUBLIC_CLIENT_URL +
      '/verify?verify_email_token=' +
      token);
    this.mailerService.sendMail({
      to: email, // list of receivers
      from: process.env.EMAIL, // sender address
      subject: 'Welcome to ' + process.env.APP_NAME + ' Confirm your email', // Subject line
      // text:
      //   'Hello ' +
      //   firstname +
      //   ' ' +
      //   lastname +
      //   ' click ' +
      //   url +
      //   ' for verify your email.', // plaintext body
      html: 'Hello ' + fullname + ' click ' + url + ' for verify your email.', // plaintext body
      // template: './confirmation',
      // context: {
      //   name: firstname + ' ' + lastname,
      //   url,
      // },
    });
    return { message: 'send verify email successfully.' };
  }

  async generateVerifyToken(id: string, fullname: string): Promise<string> {
    return await this.jwtService.sign({ userId: id, fullName: fullname });
  }

  async sendVerifyEmailToChancePassword(user: any): Promise<ResponseMessage> {
    const fullname = user.fullname;
    const token = await this.generateVerifyToken(user.id, fullname);
    const url = await (process.env.PUBLIC_CLIENT_URL +
      '/users/password/edit?reset_password_token=' +
      token);
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      from: process.env.EMAIL, // sender address
      subject: 'Reset password in ' + process.env.APP_NAME, // Subject line
      html: 'Hello ' + user.fullname + ' click ' + url + ' for reset password.', // plaintext body
      // template: './confirmation',
      // context: {
      //   name: firstname + ' ' + lastname,
      //   url,
      // },
    });
    return { message: 'Please confirm reset password in your email.' };
  }

  async sendEmailUpdateWork(
    email: string,
    workId: string,
    fullname: string,
  ): Promise<ResponseMessage> {
    const url = await (process.env.PUBLIC_CLIENT_URL +
      '/job/details/' +
      workId);
    this.mailerService.sendMail({
      to: email, // list of receivers
      from: process.env.EMAIL, // sender address
      subject: 'Your work update from ' + process.env.APP_NAME, // Subject line
      html:
        'Hello ' + fullname + ' click ' + url + ' to see your work updated.', // plaintext body
      // template: './confirmation',
      // context: {
      //   name: firstname + ' ' + lastname,
      //   url,
      // },
    });
    return { message: 'Send work updated to email successful.' };
  }
}
