import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class AddSongDto {
  @IsMongoId()
  songId: Types.ObjectId;
}
