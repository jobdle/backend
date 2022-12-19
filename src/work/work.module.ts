import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { workSchema } from 'src/model/work.model';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Work',
        useFactory: () => {
          const schema = workSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
    WorkModule,
  ],
  controllers: [WorkController],
  providers: [WorkService, JwtStrategy],
  exports: [WorkService],
})
export class WorkModule {}
