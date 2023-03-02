import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bcrypt from 'bcrypt';
import 'mongoose-paginate-v2';
import { ResponseMessage } from 'src/model/response';
import { Employee } from 'src/model/schema/employee.schema';
import { EmployeeDto } from 'src/model/dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('Employee')
    private readonly employeeModel: PaginateModel<Employee>,
  ) {}
  async findOne(id: string): Promise<EmployeeDto> {
    return await this.employeeModel.findOne({ _id: id });
  }

  async findAll(
    status: string,
    sort: string,
    order: string,
    search: string,
  ): Promise<Array<Employee>> {
    status = await (status === undefined ? 'employee' : status);
    sort = await (sort === undefined ? 'works' : sort);
    order = await (order === 'asc' || order === 'desc' ? order : 'desc');
    const typeSortToOrder = {};
    typeSortToOrder[sort] = order;
    console.log(typeSortToOrder);
    const filter = { status: status };

    if (!!search) {
      search = search.trim();
      filter['$or'] = [
        { firstname: { $regex: search, $options: 'i' } },
        { lastname: { $regex: search, $options: 'i' } },
      ];
    }

    console.log(1);
    return await this.employeeModel.find(filter).sort(typeSortToOrder);
  }

  async newEmployee(user: any, body: any): Promise<ResponseMessage> {
    try {
      body['status'] = 'employee';
      body['fullname'] = body.fristname + ' ' + body.lastname;
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
      if (body.firstname || body.lastname) {
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
    if (body.firstname && body.lastname) {
      body['fullname'] = await (body.firstname + ' ' + body.lastname);
    } else {
      const em = await this.employeeModel.findOne({ _id: id });
      if (body.fristname) {
        body['fullname'] = await (body.firstname + ' ' + em.lastname);
      } else {
        body['fullname'] = await (em.firstname + ' ' + body.lastname);
      }
    }
    return await body;
  }
}
