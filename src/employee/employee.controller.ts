import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Get()
  getHello(): string {
    return this.employeeService.getHello();
  }

  //   @UseGuards(JwtAuthGuard)
  //   @Get('profile')
  //   async getProfile(@Request() req) {
  //     return await this.EmployeeService.getOneUserData(req.user.userId);
  //   }
}
