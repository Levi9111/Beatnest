import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Song, SongDocumet } from './schemas/song.schema';
import { Model, Types } from 'mongoose';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
  constructor(@InjectModel(Song.name) private songModel: Model<SongDocumet>) {}

  async create(
    createSongDto: CreateSongDto,
    uploadedBy: Types.ObjectId,
    audioUrl: string,
    imageUrl: string,
  ): Promise<SongDocumet> {
    const newSong = await this.songModel.create({
      ...createSongDto,
      uploadedBy,
      audioUrl,
      imageUrl,
    });

    return newSong;
  }

  async findAll(): Promise<SongDocumet[]> {
    return this.songModel.find().populate('uploadedBy', 'name role').exec();
  }

  async findOne(id: string): Promise<SongDocumet> {
    const song = await this.songModel
      .findById(id)
      .populate('uploadedBy', 'name role')
      .exec();

    if (!song) throw new NotFoundException('Song not found');
    return song;
  }

  async update(
    id: string,
    updateSongDto: UpdateSongDto,
    userId: Types.ObjectId,
  ) {
    const song = await this.songModel.findById(id);
    if (!song) throw new NotFoundException('Song not found');

    if (!song.uploadedBy.equals(userId))
      throw new ForbiddenException('You can only update your own songs');

    Object.assign(song, updateSongDto);
    return await song.save();
  }

  async remove(id: string, userId: Types.ObjectId): Promise<void> {
    const song = await this.songModel.findById(id);
    if (!song) throw new NotFoundException('Song not found');
    if (!song.uploadedBy.equals(userId))
      throw new ForbiddenException('You can only delete your own songs');

    await song.deleteOne();
  }
}
