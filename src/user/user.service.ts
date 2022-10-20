import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  getHello(): string {
    return 'aaaaaaaa';
  }

  async findOne(username: string): Promise<any> {
    return await this.userModel.findOne({ username: username });
  }

  async createUserAccount(data: any): Promise<any> {
    try {
      console.log(data);
      console.log('register');
      const { firstname, lastname, username, password, email } = data;
      if (!(firstname && lastname && username && password && email)) {
        return null;
      }
      console.log('a');
      const user = await new this.userModel(data);
      return await user.save();
      return null;
    } catch (e) {
      console.log('Error at createUserAccount function in user.service');
      console.log(e);
      throw e;
    }
  }

  async getOneUserData(username: any): Promise<any> {
    const user = await this.userModel.findOne({ username: username });
    return await {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
    };
  }
}
