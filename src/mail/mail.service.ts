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
    firstname: string,
    lastname: string,
    id: string,
  ): Promise<ResponseMessage> {
    console.log(1, email);
    const fullName = await (firstname + ' ' + lastname);
    const token = await this.generateVerifyToken(id, fullName);
    const url = await (process.env.PUBLIC_CLIENT_URL +
      '/verify?verify_email_token=' +
      token);
    console.log(token);
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
      html:
        'Hello ' +
        firstname +
        ' ' +
        lastname +
        ' click ' +
        url +
        ' for verify your email.', // plaintext body
      // template: './confirmation',
      // context: {
      //   name: firstname + ' ' + lastname,
      //   url,
      // },
    });
    return { message: 'send verify email successfully.' };
  }

  async generateVerifyToken(id: string, fullName: string): Promise<string> {
    return await this.jwtService.sign({ userId: id, fullName: fullName });
  }

  async sendVerifyEmailToChancePassword(user: any): Promise<ResponseMessage> {
    const fullName = await (user.firstname + ' ' + user.lastname);
    const token = await this.generateVerifyToken(user.id, fullName);
    const url = await (process.env.PUBLIC_CLIENT_URL +
      'users/passwprd/edit?reset_password_token=' +
      token);
    console.log(token);
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      from: process.env.EMAIL, // sender address
      subject: 'Reset password in ' + process.env.APP_NAME, // Subject line
      html:
        'Hello ' +
        user.firstname +
        ' ' +
        user.lastname +
        ' click ' +
        url +
        ' for reset password.', // plaintext body
      // template: './confirmation',
      // context: {
      //   name: firstname + ' ' + lastname,
      //   url,
      // },
    });
    return { message: 'Please confirm reset password in your email.' };
  }
}
