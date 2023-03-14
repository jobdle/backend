import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import * as bcrypt from 'bcrypt';
import 'mongoose-paginate-v2';
import { ResponseMessage } from 'src/model/response';
import { Employee } from 'src/model/schema/employee.schema';
import { EmployeeDto, WorkDoneDto } from 'src/model/dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('Employee')
    private readonly employeeModel: PaginateModel<Employee>,
  ) {}
  async findOne(id: string): Promise<EmployeeDto> {
    try {
      return await this.employeeModel.findOne({ _id: id });
    } catch (e) {
      console.log('Error at findOne function in employee.service');
      console.log(e);
      throw e;
    }
  }

  async findAll(
    status: string,
    sort: string,
    order: string,
    search: string,
    category: string,
  ): Promise<Array<Employee>> {
    try {
      status = await (status === undefined ? 'employee' : status);
      sort = await (sort === undefined ? 'works' : sort);
      order = await (order === 'asc' || order === 'desc' ? order : 'desc');
      const typeSortToOrder = {};
      if (!!category) {
        const categoryFrequency = await ('categoryFrequency.' + category);
        typeSortToOrder[categoryFrequency] = order;
      } else {
        typeSortToOrder[sort] = order;
      }
      const filter = { status: status };

      if (!!search) {
        search = search.trim();
        filter['$or'] = [{ fullname: { $regex: search, $options: 'i' } }];
      }

      return await this.employeeModel.find(filter).sort(typeSortToOrder);
    } catch (e) {
      console.log('Error at findAll function in employee.service');
      console.log(e);
      throw e;
    }
  }

  async newEmployee(user: any, body: any): Promise<ResponseMessage> {
    try {
      body['categoryFrequency'] = {};
      body['status'] = 'employee';
      body['fullname'] = await ((await body.fristname) +
        ' ' +
        (await body.lastname));
      const employee = await new this.employeeModel(body);
      employee.save();
      return { message: 'Add new employee successfully.' };
    } catch (e) {
      console.log('Error at newEmployee function in employee.service');
      console.log(e);
      throw e;
    }
  }

  async softDelete(id: string): Promise<ResponseMessage> {
    try {
      const body = await { status: 'out' };
      await this.employeeModel.updateOne({ _id: id }, body);
      return { message: 'Delete empolyee successfully.' };
    } catch (e) {
      console.log('Error at softDelete function in work.service');
      console.log(e);
      throw e;
    }
  }

  async updateOneEmployee(id: any, body: any): Promise<any> {
    try {
      if ((await body.firstname) || (await body.lastname)) {
        body = await this.getAndUpdateFullname(id, body);
      }
      return await this.employeeModel.updateOne({ _id: id }, body);
    } catch (e) {
      console.log('Error at updateWork function in employee.service');
      console.log(e);
      throw e;
    }
  }

  async getAndUpdateFullname(id: string, body: any) {
    try {
      if ((await body.firstname) && (await body.lastname)) {
        body['fullname'] = (await body.firstname) + ' ' + (await body.lastname);
      } else {
        const em = await this.employeeModel.findOne({ _id: id });
        if (body.fristname) {
          body['fullname'] = (await body.firstname) + ' ' + (await em.lastname);
        } else {
          body['fullname'] = (await em.firstname) + ' ' + (await body.lastname);
        }
      }
      return await body;
    } catch (e) {
      console.log('Error at getAndUpdateFullname function in employee.service');
      console.log(e);
      throw e;
    }
  }

  async updateDoneWork(work: any) {
    try {
      const length = await work.employee.length;
      const workDone: WorkDoneDto = await {
        userId: work.userId,
        title: work.title,
        workId: work._id,
        status: work.status,
      };
      for (let i = 0; i < length; i++) {
        const employeeId = await work.employee[i]._id;
        const categoryName = await work.category.name;
        const categoryFrequency = 'categoryFrequency.' + categoryName;
        const inc = {};
        inc[categoryFrequency] = 1;
        await this.employeeModel.updateOne(
          { _id: employeeId },
          { $push: { works: workDone }, $inc: inc },
        );
      }
    } catch (e) {
      console.log('Error at updateDoneWork function in employee.service');
      console.log(e);
      throw e;
    }
  }
}
