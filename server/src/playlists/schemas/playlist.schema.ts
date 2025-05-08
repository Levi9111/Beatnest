import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Playlist extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  // @Prop([
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  //   },
  // ])
  // user: Types.ObjectId;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ])
  createdBy: Types.ObjectId;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
  ])
  songs: Types.ObjectId[];

  @Prop({ default: false })
  isPublic: boolean;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
