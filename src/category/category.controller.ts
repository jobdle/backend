import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  Delete,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CategoryDto } from 'src/model/dto/category.dto';
import { ResponseMessage } from 'src/model/response';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Request() req): Promise<Array<CategoryDto>> {
    return await this.categoryService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Request() req, @Param('id') id: string): Promise<CategoryDto> {
    return await this.categoryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async addCategory(
    @Request() req,
    @Body() body: CategoryDto,
  ): Promise<ResponseMessage> {
    return await this.categoryService.newCategory(req.user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async softDeleteOne(
    @Request() req,
    @Param('id') id: string,
  ): Promise<ResponseMessage> {
    return await this.categoryService.softDelete(id);
  }

  //@UseGuards(JwtAuthGuard)
  // @Patch(':id')
  // async patchOne(
  //   @Request() req,
  //   @Body() body: any,
  //   @Param('id') id: string,
  // ): Promise<any> {
  //   return await this.categoryService.updateOneCategory(id, body);
  // }
}
