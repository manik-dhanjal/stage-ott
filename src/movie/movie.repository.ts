import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schema/movies.schema';
import { Model } from 'mongoose';
import { MovieDocument } from './schema/movies.schema';

@Injectable()
export class MovieRepository {
  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<MovieDocument>,
  ) {}

  async create(movie: Partial<Movie>): Promise<MovieDocument> {
    const newMovie = new this.movieModel(movie);
    return newMovie.save();
  }

  async findAll(): Promise<MovieDocument[]> {
    return this.movieModel.find().exec();
  }

  async findById(id: string): Promise<Movie | null> {
    return this.movieModel.findOne({ id }).exec();
  }

  async updateById(
    id: string,
    update: Partial<Movie>,
  ): Promise<MovieDocument | null> {
    return this.movieModel
      .findOneAndUpdate({ id }, update, { new: true })
      .exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.movieModel.deleteOne({ id }).exec();
  }
}
