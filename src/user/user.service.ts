import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bcrypt from 'bcrypt';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { ResponseMessage } from 'src/model/response';
import { changePasswordDto, UserDto } from 'src/model/dto/user.dto';
import { User } from 'src/model/schema/user.schema';
import { MailService } from 'src/mail/mail.service';
import { WorkService } from 'src/work/work.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly chatroomService: ChatroomService,
    private readonly workService: WorkService,
    private readonly mailService: MailService,
  ) {}

  async findById(id: string): Promise<any> {
    return await this.userModel.findOne({ _id: id });
  }

  async findByEmail(email: string): Promise<any> {
    return await this.userModel.findOne({ email: email });
  }

  async genHashPassword(password: string): Promise<string> {
    const saltOrRounds = await Number(process.env.SALTHASH);
    return await bcrypt.hash(password, saltOrRounds);
  }

  async createUserAccount(data: UserDto): Promise<ResponseMessage> {
    try {
      const { password, email } = data;
      const checkEmail = await this.userModel.findOne({ email: email });
      if (checkEmail) {
        if (!!checkEmail.verifyEmail) {
          await this.userModel.deleteOne({ email: email });
        } else {
          throw new BadRequestException('This email is already used.');
        }
      }
      data.role = 'user';
      data.fullname = (await data.firstname) + ' ' + (await data.lastname);
      data.password = await this.genHashPassword(password);
      const user = await new this.userModel(data);
      await user.save();
      this.mailService.sendVerifyEmail(
        email,
        await user.fullname,
        await user.id,
      );
      return {
        message: 'Account created successfully. You must verify email.',
      };
    } catch (e) {
      console.log('Error at createUserAccount function in user.service');
      console.log(e);
      throw e;
    }
  }

  async getOneUserData(userId: string): Promise<any> {
    const user = await this.userModel.findOne({ _id: userId });
    return user;
  }

  async getAll(): Promise<any> {
    const user = await this.userModel.find();
    return user;
  }

  async getAndUpdateFullname(id: string, body: any) {
    if (body.firstname && body.lastname) {
      body['fullname'] = (await body.firstname) + ' ' + (await body.lastname);
    } else {
      const user = await this.findById(id);
      if (body.fristname) {
        body['fullname'] = (await body.firstname) + ' ' + (await user.lastname);
      } else {
        body['fullname'] = (await user.firstname) + ' ' + (await body.lastname);
      }
    }
    this.chatroomService.updateUserFullname(id, await body.fullname);
    this.workService.updateUserFullname(id, await body.fullname);
    return await body;
  }

  async updateOneUserData(id: string, body: any): Promise<ResponseMessage> {
    try {
      if (body.firstname || body.lastname) {
        body = await this.getAndUpdateFullname(id, body);
      }
      await this.userModel.updateOne({ _id: id }, body);
      return { message: 'Account update successfully.' };
    } catch (e) {
      console.log('Error at updateOneUserData function in user.service');
      console.log(e);
      throw e;
    }
  }

  async checkUserVerifyEmailAndSend(email: string): Promise<ResponseMessage> {
    const user = await this.userModel.findOne({ email: email });
    const check = await user.verifyEmail;
    if (check == 1) {
      return { message: 'verify email successfully.' };
    } else {
      return await this.mailService.sendVerifyEmail(
        email,
        await user.fullname,
        await user.id,
      );
    }
  }

  async resetpassword(user: any, password: string): Promise<ResponseMessage> {
    try {
      const newPassword = await this.genHashPassword(password);
      await this.updateOneUserData(await user.userId, {
        password: newPassword,
      });
      return { message: 'new password update successfully.' };
    } catch (e) {
      console.log('Error at resetpassword function in user.service');
      console.log(e);
      throw e;
    }
  }

  async changePassword(
    userId: string,
    body: changePasswordDto,
  ): Promise<ResponseMessage> {
    try {
      const user = await this.findById(userId);
      const isMatch = await bcrypt.compare(body.oldPassword, user.password);
      if (isMatch) {
        console.log('asas');
        const newPassword = await this.genHashPassword(body.newPassword);
        await this.updateOneUserData(await userId, {
          password: newPassword,
        });
        return { message: 'change password update successfully.' };
      } else {
        throw new BadRequestException('old password is incorrect');
      }
    } catch (e) {
      console.log('Error at changePassword function in user.service');
      console.log(e);
      throw e;
    }
  }
}
