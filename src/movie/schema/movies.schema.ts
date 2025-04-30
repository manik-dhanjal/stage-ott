// src/movies/schemas/movie.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Genre } from 'src/shared/enum/genre.enum';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [String], enum: Genre, default: [] })
  genres: Genre[];

  @Prop({ required: true })
  releaseDate: Date;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String], default: [] })
  actors: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
