import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Work {
  @Prop()
  userId: string;

  @Prop()
  title: string;

  @Prop()
  detail: string;

  @Prop()
  category: string;

  @Prop()
  wage: string;

  @Prop()
  note: string;

  @Prop()
  location: string;

  @Prop()
  fullname: string;

  @Prop()
  status: string;

  @Prop()
  date: Date;

  @Prop()
  deadline: Date;

  @Prop([String])
  employeeId: [string];
}

export const WorkSchema = SchemaFactory.createForClass(Work);
