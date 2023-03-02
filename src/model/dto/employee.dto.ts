import { IsString, IsISO8601 } from 'class-validator';
import { Work } from '../schema/work.schema';

export class EmployeeDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  fullname: string;

  @IsString()
  tel: string;

  @IsString()
  email: string;

  @IsISO8601()
  birthday: Date;

  @IsString()
  gender: string;

  works: Work;

  @IsString()
  status: string;

  profileImageUrl: string;
}
