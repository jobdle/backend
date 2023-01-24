import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import 'mongoose-paginate-v2';
import { getAllWorkDto, WorkDto } from 'src/model/dto/work.dto';
import { ResponseMessage } from 'src/model/response';
import { Work } from 'src/model/schema/work.schema';

@Injectable()
export class WorkService {
  constructor(
    @InjectModel('Work') private readonly workModel: PaginateModel<Work>,
  ) {}
  getHello(): string {
    return 'aaaaaaaa';
  }

  async findAll(user: any, body: getAllWorkDto): Promise<any> {
    body.page = await Number(body.page);
    const page = await (body.page > 0 ? body.page : 1);
    const status = await body.status;
    const sort = await (body.sort === undefined ? 'updatedAt' : body.sort);
    const customerId = await (body.customerId === undefined
      ? 'all'
      : body.customerId);
    const order = await (body.order === 'asc' || body.order === 'desc'
      ? body.order
      : 'desc');
    const typeSortToOrder = {};
    typeSortToOrder[sort] = order;
    const options = {
      page: page,
      limit: 10,
      sort: typeSortToOrder,
    };
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

    return await this.workModel.paginate(filter, options);
  }

  async findOne(id: string): Promise<WorkDto> {
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
