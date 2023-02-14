import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Work } from './work.schema';

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

  @Prop([Work])
  works: Work[];

  @Prop()
  status: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
