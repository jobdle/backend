import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bcrypt from 'bcrypt';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { ResponseMessage } from 'src/model/response';
import { UserDto } from 'src/model/dto/user.dto';
import { User } from 'src/model/schema/user.schema';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly chatroomService: ChatroomService,
    private readonly mailService: MailService,
  ) {}

  async findByEmail(email: string): Promise<any> {
    return await this.userModel.findOne({ email: email });
  }

  async findByUserName(username: string): Promise<any> {
    return await this.userModel.findOne({ username: username });
  }

  async genHashPassword(password: string): Promise<string> {
    const saltOrRounds = await Number(process.env.SALTHASH);
    return await bcrypt.hash(password, saltOrRounds);
  }

  async createUserAccount(data: UserDto): Promise<ResponseMessage> {
    try {
      console.log('register');
      const { username, password, email } = data;
      const checkEmail = await this.userModel.findOne({
        $or: [{ email: email }, { username: username }],
      });
      console.log(checkEmail);
      if (checkEmail) {
        throw new BadRequestException(
          'This email or username is already used.',
        );
      } else {
        data.role = 'user';
        data.password = await this.genHashPassword(password);
        const user = await new this.userModel(data);
        await user.save();
        console.log(3);
        console.log(user.id);
        this.mailService.sendVerifyEmail(
          email,
          await user.firstname,
          await user.lastname,
          await user.id,
        );
        return {
          message: 'Account created successfully. You must verify email.',
        };
      }
    } catch (e) {
      console.log('Error at createUserAccount function in user.service');
      console.log(e);
      throw e;
    }
  }

  async getOneUserData(userId: string): Promise<any> {
    const user: User = await this.userModel.findOne({ _id: userId });
    return user;
  }

  async updateOneUserData(id: string, body: any): Promise<ResponseMessage> {
    try {
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
        await user.firstname,
        await user.lastname,
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
}
