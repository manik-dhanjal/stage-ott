// src/movies/movies.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieRepository } from './movie.repository';
import { Movie, MovieSchema } from './schema/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  providers: [MovieRepository],
  exports: [MovieRepository],
})
export class MovieModule {}
