import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { ChatroomModule } from './chatroom/chatroom.module';
import { EmployeeModule } from './employee/employee.module';
import { UserModule } from './user/user.module';
import { WorkModule } from './work/work.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    AuthModule,
    UserModule,
    WorkModule,
    EmployeeModule,
    ChatroomModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
