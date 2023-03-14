import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import 'mongoose-paginate-v2';
import { ChatGateWayService } from 'src/chatGateWay/chatGateWay.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { EmployeeService } from 'src/employee/employee.service';
import { MailService } from 'src/mail/mail.service';
import { WorkDto } from 'src/model/dto/work.dto';
import { ResponseMessage } from 'src/model/response';
import { Work } from 'src/model/schema/work.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WorkService {
  constructor(
    @InjectModel('Work') private readonly workModel: PaginateModel<Work>,
    private readonly employeeService: EmployeeService,
    private readonly chatroomService: ChatroomService,
    private readonly chatGateWayService: ChatGateWayService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {}

  async findAll(
    user: any,
    status: [string],
    page: number,
    customerId: string,
    sort: string,
    order: string,
    search: string,
  ): Promise<any> {
    try {
      page = await Number(page);
      page = await (page > 0 ? page : 1);
      sort = await (sort === undefined ? 'updatedAt' : sort);
      customerId = await (customerId === undefined ? 'all' : customerId);
      order = await (order === 'asc' || order === 'desc' ? order : 'desc');
      const typeSortToOrder = {};
      typeSortToOrder[sort] = order;
      const options = {
        page: page,
        limit: 10,
        sort: typeSortToOrder,
      };
      const filter = {};

      const manyOr = [];

      if (status == undefined) {
        filter['status'] = 'new';
      } else {
        const orStatus = new Array(status.length);
        for (let i = 0; i < status.length; i++) {
          orStatus[i] = await { status: status[i] };
        }
        manyOr[0] = { $or: orStatus };
      }

      if (!!search) {
        search = search.trim();
        manyOr[1] = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { detail: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
            { fullname: { $regex: search, $options: 'i' } },
          ],
        };
      }

      filter['$and'] = manyOr;

      const role = await user.role;
      if (role == 'admin') {
        if (customerId != 'all') {
          filter['userId'] = await customerId;
        }
      } else {
        filter['userId'] = await user.userId;
      }

      return await this.workModel.paginate(filter, options);
    } catch (e) {
      console.log('Error at findAll function in work.service');
      console.log(e);
      throw e;
    }
  }

  async findById(id: string): Promise<Work> {
    try {
      return await this.workModel.findOne({ _id: id });
    } catch (e) {
      console.log('Error at findById function in work.service');
      console.log(e);
      throw e;
    }
  }

  async newWork(user: any, body: WorkDto): Promise<any> {
    try {
      body['userId'] = await user.userId;
      body['fullname'] = await user.fullname;
      body['status'] = await 'new';
      const work = await new this.workModel(body);
      return await work.save();
    } catch (e) {
      console.log('Error at createWork function in work.service');
      console.log(e);
      throw e;
    }
  }

  async updateWorkMessage(
    workId: string,
    senderId: string,
    userId: string,
    sender: string,
  ) {
    try {
      const room = await this.chatroomService.findByUserId(userId);
      const messageContent = await {
        roomId: await room.id,
        content: {
          sender: sender,
          senderId: senderId,
          content_type: 'work',
          content: workId,
          timeStamp: new Date(),
        },
      };
      await this.chatGateWayService.updateWorkMessage(messageContent);
    } catch (e) {
      console.log('Error at updateWorkMessage function in work.service');
      console.log(e);
      throw e;
    }
  }

  async sendEmailUpdateWork(userId: string, workId: string) {
    try {
      const user = await this.userService.findById(userId);
      await this.mailService.sendEmailUpdateWork(
        user.email,
        workId,
        user.fullname,
      );
    } catch (e) {
      console.log('Error at sendEmailUpdateWork function in work.service');
      console.log(e);
      throw e;
    }
  }

  async updateWork(
    user: any,
    workId: string,
    body: any,
  ): Promise<ResponseMessage> {
    try {
      const employees = await body.employee;
      if (!!employees) {
        for (let i = 0; i < employees.length; i++) {
          await delete body.employee[i].work;
        }
      }
      await this.workModel.updateOne({ _id: workId }, body);
      const work = await this.workModel.findOne({ _id: workId });
      if (body.status == 'done') {
        this.employeeService.updateDoneWork(work);
      }
      this.updateWorkMessage(
        workId,
        user.userId,
        await work.userId,
        await user.fullname,
      );
      if (user.role == 'admin') {
        this.sendEmailUpdateWork(work.userId, workId);
      }
      return { message: 'This work update successfully.' };
    } catch (e) {
      console.log('Error at updateWork function in work.service');
      console.log(e);
      throw e;
    }
  }

  async softDelete(id: string, user: any): Promise<ResponseMessage> {
    try {
      const work = await this.workModel.findOneAndUpdate(
        { _id: id },
        { status: 'cancel' },
      );
      this.updateWorkMessage(
        id,
        user.userId,
        await work.userId,
        await user.fullname,
      );
      return { message: 'This work cancel successfully.' };
    } catch (e) {
      console.log('Error at softDelete function in work.service');
      console.log(e);
      throw e;
    }
  }

  async updateUserFullname(userId: string, fullname: string) {
    try {
      await this.workModel.updateMany(
        { userId: userId },
        { fullname: fullname },
        { timestamps: false },
      );
    } catch (e) {
      console.log('Error at updateUserFullname function in work.service');
      console.log(e);
      throw e;
    }
  }

  async findForCalendar(): Promise<Work[]> {
    try {
      return await this.workModel
        .find({ status: 'pending' })
        .sort({ deadline: 'asc' });
    } catch (e) {
      console.log('Error at findForCalendar function in work.service');
      console.log(e);
      throw e;
    }
  }
}
