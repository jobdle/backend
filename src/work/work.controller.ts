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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WorkService } from './work.service';

// @UseGuards(JwtAuthGuard)
//   @Get('profile')
//   async getProfile(@Request() req) {
//     return await this.userService.getOneUserData(req.username);
//   }
@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Request() req): Promise<any> {
    return await this.workService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Request() req, @Param('id') id: string): Promise<any> {
    return await this.workService.findOne(req.user.userId, id);
  }

  // @Get(':id')
  // async getOne(@Param('id') id: string): Promise<any> {
  //   return await this.workService.findOne('6', id);
  // }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async postWork(@Request() req, @Body() body: any): Promise<any> {
    return await this.workService.newWork(req.user.userId, body);
  }

  // @Post()
  // @HttpCode(201)
  // async postWork(@Body() body: any): Promise<any> {
  //   console.log(0);
  //   console.log(body);
  //   return await this.workService.newWork('6', body);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete()
  // async deleteOne(@Request() req): Promise<any> {
  //   return await this.workService.getHello();
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put()
  // async putOne(@Request() req): Promise<any> {
  //   return await this.workService.getHello();
  // }

  // @UseGuards(JwtAuthGuard)
  // @Patch()
  // async patchOne(@Request() req): Promise<any> {
  //   return await this.workService.getHello();
  // }
}
