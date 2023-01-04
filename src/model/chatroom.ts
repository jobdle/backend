import * as mongoose from 'mongoose';

export const chatroomSchema = new mongoose.Schema({
  userId: String, //เลขห้อง
  messages: [
    {
      sender: String,
      content_type: String,
      content: String,
      timeStamp: Date,
    },
  ],
});

export interface MessageForData {
  userId: string;
  sender: string;
  content_type: string;
  content: string;
  timeStamp: Date;
}

export interface Message {
  sender: string;
  content_type: string;
  content: string;
  timeStamp: Date;
}

export interface Chatroom {
  userId: string;
  messages: Message[];
}
