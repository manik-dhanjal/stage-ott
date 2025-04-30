// src/tv-shows/schemas/tv-show.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Episode } from './episode.schema';
import { Genre } from 'src/shared/enum/genre.enum';

export type TVShowDocument = HydratedDocument<TVShow>;

@Schema({ timestamps: true })
export class TVShow {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({
    type: [String],
    default: [],
    enum: Genre,
  })
  genres: Genre[];

  @Prop({ type: [Episode], default: [] })
  episodes: Episode[];
}

export const TVShowSchema = SchemaFactory.createForClass(TVShow);
