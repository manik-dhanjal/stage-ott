// src/tv-shows/tv-show.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return this.tvShowModel.findOne({ id }).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.tvShowModel.deleteOne({ id }).exec();
  }

  async updateById(
    id: string,
    update: Partial<TVShow>,
  ): Promise<TVShowDocument | null> {
    return this.tvShowModel
      .findOneAndUpdate({ id }, update, { new: true })
      .exec();
  }
}
