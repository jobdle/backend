import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { userSchema } from 'src/model/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    UserModule,
    ChatroomModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
