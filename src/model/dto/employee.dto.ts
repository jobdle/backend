import { IsString, IsISO8601 } from 'class-validator';
import { Work } from '../schema/work.schema';
import { CategoryDto } from './category.dto';

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

  works: WorkDoneDto;

  @IsString()
  status: string;

  profileImageUrl: string;

  categoryFrequency: object;
}

export class WorkDoneDto {
  userId: string;

  title: string;

  workId: string;

  status: string;
}
