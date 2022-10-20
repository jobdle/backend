import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  email: String,
});

export interface User {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  email: string;
}
