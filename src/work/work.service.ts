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

  async findAll(userId: string, status: string): Promise<any> {
    console.log(userId);
    // const options = {               //ดูจากไทแมทชีน
    //   page: page,
    //   limit: limit,
    //   sort: typeSortToOrder,
    // };

    // const query = this.channelModel.paginate(filter, options);
    return await this.workModel.find({ userId: userId, status: status });
  }

  async findOne(userId: string, id: string): Promise<any> {
    return await this.workModel.findOne({ userId: userId, _id: id });
  }

  async newWork(user: any, body: any): Promise<any> {
    try {
      body['userId'] = await user.userId;
      body['fullname'] = await (user.firstname + ' ' + user.lastname);
      body['status'] = await 'new';
      console.log(body);
      const work = await new this.workModel(body);
      return await work.save();
    } catch (e) {
      console.log('Error at createWork function in work.service');
      console.log(e);
      throw e;
    }
  }

  async updateWork(id: any, body: any): Promise<any> {
    try {
      return await this.workModel.updateOne({ _id: id }, body);
    } catch (e) {
      console.log('Error at updateWork function in work.service');
      console.log(e);
      throw e;
    }
  }
}
