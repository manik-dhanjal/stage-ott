// src/users/user.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async findOne(query: Partial<User & {_id: Types.ObjectId}>): Promise<UserDocument | null> {
    return this.userModel.findOne(query).exec();
  }

  async deleteOne(query: Partial<User & {_id: Types.ObjectId}>): Promise<boolean> {
    const result = await this.userModel.deleteOne(query).exec();
    return result.deletedCount > 0;
  }


  async updateByUserId(
    userId: string | Types.ObjectId,
    body: Partial<User>,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, body, { new: true })
      .exec();
  }
}
