import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { ChatGateWayModule } from 'src/chatGateWay/chatGateWay.module';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { MailModule } from 'src/mail/mail.module';
import { WorkSchema } from 'src/model/schema/work.schema';
import { UserModule } from 'src/user/user.module';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Work',
        useFactory: () => {
          const schema = WorkSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
    WorkModule,
    EmployeeModule,
    ChatroomModule,
    ChatGateWayModule,
    MailModule,
    forwardRef(() => UserModule),
  ],
  controllers: [WorkController],
  providers: [WorkService, JwtStrategy],
  exports: [WorkService],
})
export class WorkModule {}
