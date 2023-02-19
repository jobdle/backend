import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
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
  ): Promise<void> {
    console.log(1, email);
    const fullName = await (firstname + ' ' + lastname);
    const token = await this.generateVerifyToken(id, fullName);
    const url = await (process.env.PUBLIC_CLIENT_URL +
      '/verify?token=' +
      token);
    console.log(token);
    this.mailerService.sendMail({
      to: email, // list of receivers
      from: process.env.EMAIL, // sender address
      subject: 'Welcome to ' + process.env.APP_NAME + ' Confirm your Email', // Subject line
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
  }

  async generateVerifyToken(id: string, fullName: string): Promise<string> {
    return await this.jwtService.sign({ userId: id, fullName: fullName });
  }
}
