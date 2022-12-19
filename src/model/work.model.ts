import * as mongoose from 'mongoose';

export const workSchema = new mongoose.Schema({
  userId: String,
  title: String,
  detail: String,
  category: String,
  wage: String,
  note: String,
  location: String,
  fullname: String,
  status: String,
  date: Date,
  deadline: Date,
});

export interface Work {
  userId: string;
  title: string;
  detail: string;
  category: string;
  wage: string;
  note: string;
  location: string;
  fullname: string;
  status: string;
  date: Date;
  deadline: Date;
}
