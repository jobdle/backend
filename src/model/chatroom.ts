import * as mongoose from 'mongoose';

export const chatroomSchema = new mongoose.Schema({
  userId: String, //เลขห้อง
  messages: [
    {
      sender: String, //userId?
      content_type: String,
      content: String,
      timeStamp: Date,
    },
  ],
  lastIndexMessage: Number,
});

export interface MessageForData {
  roomId: string;
  senderId: string; //userId?
  content_type: string;
  content: string;
  timeStamp: Date;
}

export interface Message {
  senderId: string; //userId?
  content_type: string;
  content: string;
  timeStamp: Date;
}

export interface Chatroom {
  userId: string;
  messages: Message[];
}
