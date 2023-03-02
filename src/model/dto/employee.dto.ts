import { IsString, IsNumber } from 'class-validator';
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

  @IsNumber()
  age: number;

  @IsString()
  gender: string;

  works: Work;

  @IsString()
  status: string;

  profileImageUrl: string;
}
