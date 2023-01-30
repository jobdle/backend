import { IsString, IsArray, ValidateNested, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageForDataDto {
  @IsString()
  roomId: string;

  @IsString()
  senderId: string; //userId?

  @IsString()
  content_type: string;

  @IsString()
  content: string;

  @IsISO8601()
  timeStamp: Date;
}

export class MessageDto {
  @IsString()
  senderId: string; //userId?

  @IsString()
  content_type: string;

  @IsString()
  content: string;

  @IsISO8601()
  timeStamp: Date;
}

export class ChatroomDto {
  @IsString()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true }) //ตรวจไส้ในด้วย
  @Type(() => MessageDto) //เน็ตบอกว่าเพื่อข้างบนไม่ติดมั้ง
  messages: MessageDto[];
}