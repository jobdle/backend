import { IsString, IsArray, IsISO8601 } from 'class-validator';

export class WorkDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  detail: string;

  @IsString()
  category: string;

  @IsString()
  wage: string;

  @IsString()
  note: string;

  @IsString()
  location: string;

  @IsString()
  fullname: string;

  @IsString()
  status: string;

  @IsISO8601()
  deadline: Date;

  @IsArray()
  employeeId: [string];
}

export class getAllWorkDto {
  status: null | [string];
  page: null | number;
  customerId: null | string;
  sort: null | string;
  order: null | string;
}
