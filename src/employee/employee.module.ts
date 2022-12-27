import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { employeeSchema } from 'src/model/employee.model';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Employee', schema: employeeSchema }]),
    EmployeeModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, JwtStrategy],
  exports: [EmployeeService],
})
export class EmployeeModule {}
