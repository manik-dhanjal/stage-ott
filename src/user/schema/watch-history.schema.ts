import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class WatchHistory {
  @Prop({ required: true, type: String })
  contentId: string;

  @Prop({ required: true, type: Date })
  watchedOn: Date;

  @Prop({ type: Number, required: false })
  rating?: number;
}
