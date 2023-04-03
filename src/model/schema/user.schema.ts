import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  fullname: string;

  @Prop()
  password: string;

  @Prop()
  role: string;

  @Prop()
  email: string;

  @Prop()
  verifyEmail: number;

  @Prop()
  profileImageUrl: string;

  @Prop()
  tel: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
