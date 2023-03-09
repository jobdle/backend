import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  HttpCode,
  Body,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { EmployeeDto } from 'src/model/dto/employee.dto';
import { ResponseMessage } from 'src/model/response';
import { Category } from 'src/model/schema/category.schema';
import { Employee } from 'src/model/schema/employee.schema';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  //@UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query('status') status: string,
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('search') search: string,
    @Query('category') category: string,
  ): Promise<Array<Employee>> {
    status = status === undefined ? 'employee' : status;
    return await this.employeeService.findAll(
      status,
      sort,
      order,
      search,
      category,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Request() req, @Param('id') id: string): Promise<EmployeeDto> {
    return await this.employeeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async addEmployee(
    @Request() req,
    @Body() body: any,
  ): Promise<ResponseMessage> {
    return await this.employeeService.newEmployee(req.user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async softDeleteOne(@Request() req, @Param('id') id: string): Promise<any> {
    return await this.employeeService.softDelete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patchOne(
    @Request() req,
    @Body() body: any,
    @Param('id') id: string,
  ): Promise<any> {
    return await this.employeeService.updateOneEmployee(id, body);
  }
}
