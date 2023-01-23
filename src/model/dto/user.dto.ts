import { IsString } from 'class-validator';

export class UserDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  email: string;

  role: null | string;
}
