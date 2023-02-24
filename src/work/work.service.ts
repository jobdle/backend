import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import 'mongoose-paginate-v2';
import { WorkDto } from 'src/model/dto/work.dto';
import { ResponseMessage } from 'src/model/response';
import { Work } from 'src/model/schema/work.schema';

@Injectable()
export class WorkService {
  constructor(
    @InjectModel('Work') private readonly workModel: PaginateModel<Work>,
  ) {}

  async findAll(
    user: any,
    status: [string],
    page: number,
    customerId: string,
    sort: string,
    order: string,
  ): Promise<any> {
    page = await Number(page);
    page = await (page > 0 ? page : 1);
    sort = await (sort === undefined ? 'updatedAt' : sort);
    customerId = await (customerId === undefined ? 'all' : customerId);
    order = await (order === 'asc' || order === 'desc' ? order : 'desc');
    const typeSortToOrder = {};
    typeSortToOrder[sort] = order;
    const options = {
      page: page,
      limit: 10,
      sort: typeSortToOrder,
    };
    console.log(typeSortToOrder);
    const filter = {};
    if (status == undefined) {
      filter['status'] = 'new';
    } else {
      const orStatus = [];
      for (let i = 0; i < status.length; i++) {
        orStatus[i] = await { status: status[i] };
      }
      filter['$or'] = orStatus;
    }

    const role = await user.role;
    if (role == 'admin') {
      if (customerId != 'all') {
        filter['userId'] = await customerId;
      }
    } else {
      filter['userId'] = await user.userId;
    }
    console.log(filter);

    return await this.workModel.paginate(filter, options);
  }

  async findOne(id: string): Promise<Work> {
    return await this.workModel.findOne({ _id: id });
  }

  async newWork(user: any, body: WorkDto): Promise<any> {
    try {
      body['userId'] = await user.userId;
      body['fullname'] = await user.fullname;
      body['status'] = await 'new';
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
