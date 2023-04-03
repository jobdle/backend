import { IsString, IsArray, IsISO8601, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Employee } from '../schema/employee.schema';
import { CategoryDto } from './category.dto';

export class WorkDto {
  userId: string;

  @IsString()
  title: string;

  @IsString()
  detail: string;

  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  category: CategoryDto;

  wage: string;

  @IsString()
  location: string;

  fullname: string;

  status: string;

  @IsISO8601()
  deadline: Date;

  employee: [Employee];

  @IsArray()
  pictureUrl: [string];
}
