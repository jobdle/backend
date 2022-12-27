import * as mongoose from 'mongoose';

export const employeeSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  tel: String,
  email: String,
  age: Number,
  gender: String,
  works: [{ id: String, title: String }],
});

export interface Employee {
  firstname: string;
  lastname: string;
  tel: string;
  email: string;
  age: number;
  gender: string;
  works: [{ id: string; title: string }];
}
