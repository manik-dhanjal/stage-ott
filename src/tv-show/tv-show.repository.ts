// src/tv-shows/tv-show.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TVShow, TVShowDocument } from './schema/tv-show.schema';

@Injectable()
export class TVShowRepository {
  constructor(
    @InjectModel(TVShow.name)
    private readonly tvShowModel: Model<TVShowDocument>,
  ) {}

  async create(tvShow: Partial<TVShow>): Promise<TVShowDocument> {
    const newTVShow = new this.tvShowModel(tvShow);
    return newTVShow.save();
  }

  async findAll(): Promise<TVShowDocument[]> {
    return this.tvShowModel.find().exec();
  }

  async findById(id: string): Promise<TVShowDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.tvShowModel.findOne({ _id: id }).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.tvShowModel.deleteOne({ _id: id }).exec();
  }

  async updateById(
    id: string,
    update: Partial<TVShow>,
  ): Promise<TVShowDocument | null> {
    return this.tvShowModel
      .findOneAndUpdate({ _id: id }, update, { new: true })
      .exec();
  }
}
