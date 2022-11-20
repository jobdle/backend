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
  async getAll(@Request() req, @Query('status') status: string): Promise<any> {
    return await this.workService.findAll(req.user.userId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Request() req, @Param('id') id: string): Promise<any> {
    return await this.workService.findOne(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async postWork(@Request() req, @Body() body: any): Promise<any> {
    return await this.workService.newWork(req.user, body);
  }

  // @UseGuards(JwtAuthGuard)
  // @Delete()
  // async deleteOne(@Request() req): Promise<any> {
  //   return await this.workService.getHello();
  // }

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
