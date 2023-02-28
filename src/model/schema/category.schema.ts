import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop()
  name: string;

  @Prop()
  minWage: number;

  @Prop()
  color: string;

  @Prop()
  deleteAt: Date | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
