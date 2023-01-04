import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../model/user.model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bcrypt from 'bcrypt';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { ResponseMessage } from 'src/model/response';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly chatroomService: ChatroomService,
  ) {}
  getHello(): string {
    return 'aaaaaaaa';
  }

  async findOne(username: string): Promise<User> {
    return await this.userModel.findOne({ username: username });
  }

  async createUserAccount(data: User): Promise<ResponseMessage> {
    try {
      console.log('register');
      const { firstname, lastname, username, password, email }: User = data;
      if (!(firstname && lastname && username && password && email)) {
        throw new BadRequestException('Some fields are missing.');
      }
      const checkEmail = await this.userModel.findOne({
        $or: [{ email: email }, { username: username }],
      });
      console.log(checkEmail);
      if (checkEmail) {
        throw new BadRequestException(
          'This email or username is already used.',
        );
      }
      data.role = 'user';
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      data.password = hash;
      const user = await new this.userModel(data);
      await user.save();
      this.chatroomService.newroom(await user.id);
      return { message: 'Account created successfully.' };
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

  async getName(userId: string): Promise<any> {
    const user: User = await this.userModel.findOne({ _id: userId });
    return await (user.firstname + '' + user.lastname);
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
}
