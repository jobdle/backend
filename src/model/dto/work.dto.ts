import { IsString, IsArray, IsISO8601, ValidateNested } from 'class-validator';
import { CategoryDto } from './category.dto';
import { Type } from 'class-transformer';

export class WorkDto {
  userId: string;

  @IsString()
  title: string;

  @IsString()
  detail: string;

  @ValidateNested({ each: true }) //ตรวจไส้ในด้วย
  @Type(() => CategoryDto) //เน็ตบอกว่าเพื่อข้างบนไม่ติดมั้ง
  category: CategoryDto;

  @IsString()
  wage: string;

  note: string;

  @IsString()
  location: string;

  fullname: string;

  status: string;

  @IsISO8601()
  deadline: Date;

  employeeId: [string];
}
