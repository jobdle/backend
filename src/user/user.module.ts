import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { MailModule } from 'src/mail/mail.module';
import { UserSchema } from 'src/model/schema/user.schema';
import { WorkModule } from 'src/work/work.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UserModule,
    ChatroomModule,
    MailModule,
    WorkModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
