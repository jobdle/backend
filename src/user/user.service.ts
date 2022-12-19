import { Injectable } from '@nestjs/common';
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
        return null;
      }
      const checkEmail = await this.userModel.findOne({ email: email });
      if (checkEmail) {
        return null;
      }
      data.role = 'user';
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      data.password = hash;
      const user = await new this.userModel(data);
      return await user.save();
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
}
