import { IsString, IsArray, IsISO8601, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '../schema/category.schema';
import { Employee } from '../schema/employee.schema';
import { CategoryDto } from './category.dto';
import { EmployeeDto } from './employee.dto';

export class WorkDto {
  userId: string;

  @IsString()
  title: string;

  @IsString()
  detail: string;

  @ValidateNested({ each: true }) //ตรวจไส้ในด้วย
  @Type(() => CategoryDto) //เน็ตบอกว่าเพื่อข้างบนไม่ติดมั้ง
  category: CategoryDto;

  wage: string;

  @IsString()
  location: string;

  fullname: string;

  status: string;

  @IsISO8601()
  deadline: Date;

  employee: [Employee];

  pictureUrl: [string];
}
