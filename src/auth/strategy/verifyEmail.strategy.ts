import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class VerifyEmailStrategy extends PassportStrategy(
  Strategy,
  'verifyEmailToken',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_EMAIL_KEY,
    });
  }

  async validate(payload: any) {
    return await {
      userId: payload.userId,
      fullName: payload.fullName,
    };
  }
}
