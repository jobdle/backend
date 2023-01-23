import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WorkDataForEmployeeDto } from '../dto/employee.dto';

@Schema({ timestamps: true })
export class Employee {
  @Prop()
  firstname: string;
  @Prop()
  lastname: string;
  @Prop()
  tel: string;
  @Prop()
  email: string;
  @Prop()
  age: number;
  @Prop()
  gender: string;
  @Prop([WorkDataForEmployeeDto])
  works: WorkDataForEmployeeDto[];
  @Prop()
  status: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
