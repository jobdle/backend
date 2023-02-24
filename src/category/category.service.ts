import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDto } from 'src/model/dto/category.dto';
import { ResponseMessage } from 'src/model/response';
import { Category } from 'src/model/schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async findAll() {
    try {
      const categorys = await this.categoryModel.find({ deleteAt: null });
      return categorys;
    } catch (e) {
      console.log('Error at findAll function in category.service');
      console.log(e);
      throw e;
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.categoryModel.findOne({ _id: id });
      return category;
    } catch (e) {
      console.log('Error at findOne function in category.service');
      console.log(e);
      throw e;
    }
  }

  async newCategory(user: any, body: CategoryDto): Promise<ResponseMessage> {
    try {
      const name = await body.name;
      const checkName = await this.categoryModel.findOne({
        name: name,
        deleteAt: null,
      });
      if (checkName) {
        throw new BadRequestException('This category name is already used.');
      }
      const category = await new this.categoryModel(body);
      category.save();
      return { message: 'Add new category successfully.' };
    } catch (e) {
      console.log('Error at newCategory function in category.service');
      console.log(e);
      throw e;
    }
  }

  async softDelete(id: string): Promise<ResponseMessage> {
    try {
      const body = await { deleteAt: new Date() };
      await this.categoryModel.updateOne({ _id: id }, body);
      return { message: 'Delete category successfully.' };
    } catch (e) {
      console.log('Error at softDelete function in category.service');
      console.log(e);
      throw e;
    }
  }

  async updateOneCategory(id: any, body: any): Promise<any> {
    try {
      return await this.categoryModel.updateOne({ _id: id }, body);
    } catch (e) {
      console.log('Error at updateOneCategory function in category.service');
      console.log(e);
      throw e;
    }
  }
}
