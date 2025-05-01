import { Prop, Schema } from '@nestjs/mongoose';
import { Genre } from '../../shared/enum/genre.enum';

@Schema({ _id: false })
export class Preferences {
  @Prop({ type: [String], enum: Genre, default: [] })
  favoriteGenres: Genre[];

  @Prop({ type: [String], enum: Genre, default: [] })
  dislikedGenres: Genre[];
}
