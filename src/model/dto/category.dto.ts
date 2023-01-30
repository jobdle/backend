import { IsString, IsNumber } from 'class-validator';

export class CategoryDto {
  @IsString()
  name: string;

  @IsNumber()
  minWage: number;
}
