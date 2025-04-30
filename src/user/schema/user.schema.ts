import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Preferences } from './preferences.schema';
import { WatchHistory } from './watch-history.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String })
  username: string;

  @Prop({ type: Preferences, required: true })
  preferences: Preferences;

  @Prop({ type: [WatchHistory], default: [] })
  watchHistory: WatchHistory[];

  @Prop({ required: true, type: String })
  password: string; // Will be hashed before saving
}

export const UserSchema = SchemaFactory.createForClass(User);
