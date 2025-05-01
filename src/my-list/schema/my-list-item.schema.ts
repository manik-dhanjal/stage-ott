import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Movie } from '../../movie/schema/movie.schema';
import { ContentType } from '../../shared/enum/content-type.enum';
import { TVShow } from '../../tv-show/schema/tv-show.schema';
import { User } from '../../user/schema/user.schema';

@Schema({ timestamps: true })
export class MyListItem {
  @Prop({
    required: true,
    ref: User.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  user: Types.ObjectId;

  @Prop({
    required: false,
    ref: Movie.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  movie?: Types.ObjectId;

  @Prop({
    required: false,
    ref: TVShow.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  tvShow?: Types.ObjectId;

  @Prop({ required: true, type: String, enum: ContentType })
  contentType: ContentType;
}

export type MyListItemDocument = HydratedDocument<MyListItem>;

export const MyListItemSchema = SchemaFactory.createForClass(MyListItem);

// Add compound indexes to prevent duplicate entries
MyListItemSchema.index({ user: 1 }, { sparse: true });
