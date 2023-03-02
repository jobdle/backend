import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  tel: string;

  @Prop()
  email: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop([Work])
  works: Work[];

  @Prop()
  status: string;

  @Prop()
  profileImageUrl: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
