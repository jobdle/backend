import {
  Controller,
  Get,
  Post,
  HttpCode,
  Put,
  Delete,
  Patch,
  UseGuards,
  Request,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WorkService } from './work.service';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Request() req,
    @Query('status') status: string,
    @Query('page') page: number,
    @Query('customerId') customerId: string,
  ): Promise<any> {
    page = await Number(page);
    status = status === undefined ? 'new' : status;
    page = await (page > 0 ? page : 1);
    customerId = customerId === undefined ? 'all' : customerId;
    return await this.workService.findAll(req.user, status, page, customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Request() req, @Param('id') id: string): Promise<any> {
    return await this.workService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async postWork(@Request() req, @Body() body: any): Promise<any> {
    console.log('hi');
    return await this.workService.newWork(req.user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async softDeleteOne(@Request() req, @Param('id') id: string): Promise<any> {
    return await this.workService.softDelete(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put()
  // async putOne(@Request() req, @Body() body: any): Promise<any> {
  //   return await this.workService.putWork(req.user, body);
  // }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patchOne(
    @Request() req,
    @Body() body: any,
    @Param('id') id: string,
  ): Promise<any> {
    return await this.workService.updateWork(id, body);
  }
}
