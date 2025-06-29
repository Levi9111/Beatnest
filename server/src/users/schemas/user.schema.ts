import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USER_ROLES, UserRole } from './users.const';
import { Playlist } from 'src/playlists/schemas/playlist.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, sparse: true, default: null })
  userName: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null, sparse: true })
  about?: string;

  @Prop({ default: [] })
  likedGenres: string[];

  // TODO:
  // Very important: later make password optional only for socail login

  // @Prop({ required: true })
  // password: string;

  @Prop()
  password?: string;

  @Prop({ default: null })
  provider: string;

  @Prop({ default: null })
  providerId: string;

  @Prop({ enum: USER_ROLES, default: USER_ROLES[0] })
  role: UserRole;

  @Prop({ type: String, default: null, sparse: true })
  otp: string | null;

  @Prop({ type: String, default: null, sparse: true })
  otpExpiresAt: string;

  @Prop({ type: [String], default: [] })
  purchasedSongs: string[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'Playlist',
    default: [],
  })
  likedPlaylists: Playlist[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    default: [],
  })
  followingArtists: UserDocument[];

  @Prop({
    type: [Types.ObjectId],
    default: [],
  })
  likedSongs: Types.ObjectId[];

  @Prop({ default: false })
  isAuthenticated: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
