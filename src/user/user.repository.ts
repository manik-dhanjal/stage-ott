// src/users/user.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { WatchHistory } from './schema/watch-history.schema';
import { Preferences } from './schema/preferences.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(data: Partial<User>): Promise<UserDocument> {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async updatePreferences(
    userId: string,
    preferences: Preferences,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { preferences }, { new: true })
      .exec();
  }

  async addToWatchHistory(
    userId: string,
    historyEntry: WatchHistory,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { watchHistory: historyEntry } },
        { new: true },
      )
      .exec();
  }

  async clearWatchHistory(userId: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { watchHistory: [] }, { new: true })
      .exec();
  }
}
