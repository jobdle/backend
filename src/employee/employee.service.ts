import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bcrypt from 'bcrypt';
import 'mongoose-paginate-v2';
import { Employee } from 'src/model/employee.model';
import { ResponseMessage } from 'src/model/response';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('Employee')
    private readonly employeeModel: PaginateModel<Employee>,
  ) {}
  async findOne(id: string): Promise<Employee> {
    return await this.employeeModel.findOne({ _id: id });
  }

  async findAll(user: any, status: string): Promise<Array<Employee>> {
    return await this.employeeModel.find({ status: status });
  }

  async newEmployee(user: any, body: any): Promise<ResponseMessage> {
    try {
      body['status'] = 'employee';
      const employee = await new this.employeeModel(body);
      employee.save();
      return { message: 'Add new employee successfully.' };
    } catch (e) {
      console.log('Error at newEmployee function in employee.service');
      console.log(e);
      throw e;
    }
  }

  async softDelete(id: string): Promise<any> {
    try {
      const body = await { status: 'out' };
      return await this.employeeModel.updateOne({ _id: id }, body);
    } catch (e) {
      console.log('Error at softDelete function in work.service');
      console.log(e);
      throw e;
    }
  }

  async updateOneEmployee(id: any, body: any): Promise<any> {
    try {
      return await this.employeeModel.updateOne({ _id: id }, body);
    } catch (e) {
      console.log('Error at updateWork function in employee.service');
      console.log(e);
      throw e;
    }
  }
}
