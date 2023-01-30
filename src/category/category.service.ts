import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDto } from 'src/model/dto/category.dto';
import { Category } from 'src/model/schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async newCategory(user: any, body: CategoryDto) {
    try {
      const category = await new this.categoryModel(body);
      category.save();
      return { message: 'Add new employee successfully.' };
    } catch (e) {
      console.log('Error at newCategory function in category.service');
      console.log(e);
      throw e;
    }
  }
}
