import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WorkDoneDto } from '../dto/employee.dto';
import { Work } from './work.schema';

@Schema({ timestamps: true })
export class Employee {
  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  fullname: string;

  @Prop()
  birthday: Date;

  @Prop()
  tel: string;

  @Prop()
  email: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop([WorkDoneDto])
  works: WorkDoneDto[];

  @Prop()
  status: string;

  @Prop()
  profileImageUrl: string;

  @Prop({
    type: Map,
    of: Number,
  })
  categoryFrequency: object;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
