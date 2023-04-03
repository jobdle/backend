import { IsString, IsISO8601 } from 'class-validator';

export class MessageForDataDto {
  @IsString()
  roomId: string;

  @IsString()
  senderId: string;

  @IsString()
  content_type: string;

  @IsString()
  content: string;

  @IsISO8601()
  timeStamp: Date;
}

export class MessageDto {
  @IsString()
  senderId: string;

  @IsString()
  content_type: string;

  @IsString()
  content: string;

  @IsISO8601()
  timeStamp: Date;
}
