import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../model/user.model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  getHello(): string {
    return 'aaaaaaaa';
  }

  async findOne(username: string): Promise<any> {
    return await this.userModel.findOne({ username: username });
  }

  async createUserAccount(data: User): Promise<any> {
    try {
      console.log(data);
      console.log('register');
      const { firstname, lastname, username, password, email } = data;
      if (!(firstname && lastname && username && password && email)) {
        throw new BadRequestException('Some fields are missing.');
      }
      const checkEmail = await this.userModel.findOne({ email: email });
      if (checkEmail) {
        throw new BadRequestException('This email is already used.');
      }
      data.role = 'user';
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      data.password = hash;
      const user = await new this.userModel(data);
      await user.save();
      return { message: 'Account created successfully.' };
    } catch (e) {
      console.log('Error at createUserAccount function in user.service');
      console.log(e);
      throw e;
    }
  }

  async getOneUserData(userId: any): Promise<any> {
    const user = await this.userModel.findOne({ _id: userId });
    return await {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async updateOneUserData(id: any, body: any): Promise<any> {
    try {
      return await this.userModel.updateOne({ _id: id }, body);
    } catch (e) {
      console.log('Error at updateOneUserData function in user.service');
      console.log(e);
      throw e;
    }
  }
}
