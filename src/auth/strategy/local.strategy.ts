import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDto } from 'src/model/dto/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    }); // config
  }

  async validate(email: string, password: string) {
    console.log('1', email, password);
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      console.log('2');
      throw new UnauthorizedException();
    }
    return user;
  }
}
