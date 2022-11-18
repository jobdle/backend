import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { workSchema } from 'src/model/work.model';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Work', schema: workSchema }]),
    WorkModule,
  ],
  controllers: [WorkController],
  providers: [WorkService, JwtStrategy],
  exports: [WorkService],
})
export class WorkModule {}
