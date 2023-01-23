import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EmployeeDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  tel: string;

  @IsString()
  email: string;

  @IsNumber()
  age: number;

  @IsString()
  gender: string;

  @IsArray()
  @ValidateNested({ each: true }) //ตรวจไส้ในด้วย
  @Type(() => WorkDataForEmployeeDto) //เน็ตบอกว่าเพื่อข้างบนไม่ติดมั้ง
  works: WorkDataForEmployeeDto[];

  @IsString()
  status: string;
}

export class WorkDataForEmployeeDto {
  @IsString()
  id: string;

  @IsString()
  title: string;
}
