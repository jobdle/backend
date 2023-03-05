import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  fullname: null | string;

  @IsString()
  tel: string;

  @IsString()
  password: string;

  @IsString()
  email: string;

  role: null | string;
}
