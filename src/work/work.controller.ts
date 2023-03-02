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
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { WorkDto } from 'src/model/dto/work.dto';
import { ResponseMessage } from 'src/model/response';
import { Work } from 'src/model/schema/work.schema';
import { WorkService } from './work.service';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOneStatus(
    @Request() req,
    @Query('status') status: [string],
    @Query('page') page: number,
    @Query('customerId') customerId: string,
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('search') search: string,
  ): Promise<Work[]> {
    return await this.workService.findAll(
      req.user,
      status,
      page,
      customerId,
      sort,
      order,
      search,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Request() req, @Param('id') id: string): Promise<Work> {
    console.log(id);
    return await this.workService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async postWork(
    @Request() req,
    @Body() body: WorkDto,
  ): Promise<ResponseMessage> {
    return await this.workService.newWork(req.user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async softDeleteOne(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ResponseMessage> {
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
