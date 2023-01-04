import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import 'mongoose-paginate-v2';
import { ResponseMessage } from 'src/model/response';
import { Work } from 'src/model/work.model';

@Injectable()
export class WorkService {
  constructor(
    @InjectModel('Work') private readonly workModel: PaginateModel<Work>,
  ) {}
  getHello(): string {
    return 'aaaaaaaa';
  }

  async findAll(
    user: any,
    status: string,
    page: number,
    customerId: string,
  ): Promise<any> {
    const userId = await user.userId;
    const role = await user.role;
    const options = {
      page: page,
      limit: 10,
      sort: 'date',
    };
    let filter;
    if (role == 'admin') {
      if (customerId == 'all') {
        filter = await { status: status };
      } else {
        filter = await { userId: customerId, status: status };
      }
    } else {
      filter = await { userId: userId, status: status };
    }

    return await this.workModel.paginate(filter, options);
    // return await this.workModel.find({ userId: userId, status: status });
    //ยังไม่ได้เช็คว่าsortถูกไหม
  }

  async findOne(id: string): Promise<Work> {
    return await this.workModel.findOne({ _id: id });
  }

  async newWork(user: any, body: Work): Promise<any> {
    try {
      body['userId'] = await user.userId;
      body['fullname'] = await user.fullname;
      body['status'] = await 'new';
      body['date'] = await new Date();
      console.log(typeof body['deadline']);
      console.log(typeof body['date']);
      console.log(body);
      const work = await new this.workModel(body);
      return await work.save();
    } catch (e) {
      console.log('Error at createWork function in work.service');
      console.log(e);
      throw e;
    }
  }

  async updateWork(id: string, body: any): Promise<ResponseMessage> {
    try {
      await this.workModel.updateOne({ _id: id }, body);
      return { message: 'This work update successfully.' };
    } catch (e) {
      console.log('Error at updateWork function in work.service');
      console.log(e);
      throw e;
    }
  }

  async softDelete(id: string): Promise<ResponseMessage> {
    try {
      await this.workModel.updateOne({ _id: id }, { status: 'cancel' });
      return { message: 'This work cancel successfully.' };
    } catch (e) {
      console.log('Error at softDelete function in work.service');
      console.log(e);
      throw e;
    }
  }
}
