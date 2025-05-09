import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USER_ROLES, UserRole } from './users.const';
import { Playlist } from 'src/playlists/schemas/playlist.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: USER_ROLES, default: USER_ROLES[0] })
  role: UserRole;

  @Prop({ type: [String], default: [] })
  purchasedSongs: string[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'Playlist',
    default: [],
  })
  likedPlaylists: Playlist[];
}

export const UserSchema = SchemaFactory.createForClass(User);
