import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MessageDto } from '../dto/chatroom.dto';

@Schema({ timestamps: true })
export class Chatroom {
  @Prop()
  nameOfUser: string;

  @Prop()
  userId: string;

  @Prop([MessageDto])
  messages: MessageDto[];

  @Prop()
  lastIndexMessage: number;
}

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);
