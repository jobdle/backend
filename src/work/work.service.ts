import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Work } from 'src/model/work.model';

@Injectable()
export class WorkService {
  constructor(@InjectModel('Work') private readonly workModel: Model<Work>) {}
  getHello(): string {
    return 'aaaaaaaa';
  }

  async findAll(userId: string): Promise<any> {
    console.log(userId);
    return await this.workModel.find({ userId: userId });
  }

  async findOne(userId: string, id: string): Promise<any> {
    return await this.workModel.findOne({ userId: userId, _id: id });
  }

  async newWork(user: any, body: any): Promise<any> {
    try {
      console.log(1);
      body['userId'] = await user.userId;
      body['fullname'] = await (user.firstname + ' ' + user.lastname);
      console.log(body);
      const work = await new this.workModel(body);
      return await work.save();
    } catch (e) {
      console.log('Error at createWork function in work.service');
      console.log(e);
      throw e;
    }
  }
}
