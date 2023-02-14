import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { VerifyEmailStrategy } from './strategy/verifyEmail.strategy';
import { MailModule } from 'src/mail/mail.module';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    PassportModule.register({ session: true }),
    UserModule,
    ChatroomModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, VerifyEmailStrategy],
  exports: [AuthService],
})
export class AuthModule {}
