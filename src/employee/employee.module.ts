import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { EmployeeSchema } from 'src/model/schema/employee.schema';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }]),
    EmployeeModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, JwtStrategy],
  exports: [EmployeeService],
})
export class EmployeeModule {}
