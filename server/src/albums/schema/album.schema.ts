import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Album extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  genre: string;

  @Prop()
  coverImage: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  artist: string;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Song',
      },
    ],
    default: [],
  })
  songs: Types.ObjectId[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
