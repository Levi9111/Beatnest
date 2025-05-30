import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Song {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true })
  audioUrl: string;

  @Prop({ required: true })
  coverImageUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;

  @Prop({ default: 0 })
  price: number;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  })
  purchasedBy: Types.ObjectId[];

  @Prop({ default: 0 })
  playCount: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
  })
  likedBy: Types.ObjectId[];
}

export type SongDocumet = Song & Document;
export const SongSchema = SchemaFactory.createForClass(Song);
