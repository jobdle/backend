import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { ResponseMessage } from 'src/model/response';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private jwtService: JwtService,
  ) {}
  async sendVerifyEmail(
    email: string,
    fullname: string,
    id: string,
  ): Promise<ResponseMessage> {
    try {
      const token = await this.generateVerifyToken(id, fullname);
      const url = await (process.env.PUBLIC_CLIENT_URL +
        '/verify?verify_email_token=' +
        token);
      this.mailerService.sendMail({
        to: email,
        from: process.env.EMAIL,
        subject: 'Welcome to ' + process.env.APP_NAME + ' Confirm your email',
        html: 'Hello ' + fullname + ' click ' + url + ' for verify your email.',
      });
      return { message: 'send verify email successfully.' };
    } catch (e) {
      console.log('Error at sendVerifyEmail function in mail.service');
      console.log(e);
      throw e;
    }
  }

  async generateVerifyToken(id: string, fullname: string): Promise<string> {
    try {
      return await this.jwtService.sign({ userId: id, fullname: fullname });
    } catch (e) {
      console.log('Error at generateVerifyToken function in mail.service');
      console.log(e);
      throw e;
    }
  }

  async sendVerifyEmailToChancePassword(user: any): Promise<ResponseMessage> {
    try {
      const fullname = user.fullname;
      const token = await this.generateVerifyToken(user.id, fullname);
      const url = await (process.env.PUBLIC_CLIENT_URL +
        '/users/password/edit?reset_password_token=' +
        token);
      this.mailerService.sendMail({
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Reset password in ' + process.env.APP_NAME,
        html:
          'Hello ' + user.fullname + ' click ' + url + ' for reset password.',
      });
      return { message: 'Please confirm reset password in your email.' };
    } catch (e) {
      console.log(
        'Error at sendVerifyEmailToChancePassword function in mail.service',
      );
      console.log(e);
      throw e;
    }
  }

  async sendEmailUpdateWork(
    email: string,
    workId: string,
    fullname: string,
  ): Promise<ResponseMessage> {
    try {
      const url = await (process.env.PUBLIC_CLIENT_URL +
        '/job/details/' +
        workId);
      this.mailerService.sendMail({
        to: email,
        from: process.env.EMAIL,
        subject: 'Your work update from ' + process.env.APP_NAME,
        html:
          'Hello ' + fullname + ' click ' + url + ' to see your work updated.',
      });
      return { message: 'Send work updated to email successful.' };
    } catch (e) {
      console.log('Error at sendEmailUpdateWork function in mail.service');
      console.log(e);
      throw e;
    }
  }
}
