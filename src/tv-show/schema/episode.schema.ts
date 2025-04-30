import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class Episode {
  @Prop({ required: true, type: Number })
  episodeNumber: number;

  @Prop({ required: true, type: Number })
  seasonNumber: number;

  @Prop({ required: true, type: Date })
  releaseDate: Date;

  @Prop({ required: true, type: String })
  director: string;

  @Prop({ type: [String], default: [] })
  actors: string[];
}
