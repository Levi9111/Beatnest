import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist } from './schemas/playlist.schema';
import { Model, Types } from 'mongoose';
import { Song, SongDocumet } from 'src/songs/schemas/song.schema';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddSongDto } from './dto/add-song.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<Playlist>,
    @InjectModel(Song.name)
    private readonly songModel: Model<SongDocumet>,
  ) {}

  async create(
    createPlaylistDto: CreatePlaylistDto,
    userId: Types.ObjectId,
  ): Promise<Playlist> {
    const createPlaylist = await this.playlistModel.create({
      ...createPlaylistDto,
      createdBy: userId,
    });

    return createPlaylist;
  }

  async findAll(userId: Types.ObjectId): Promise<Playlist[]> {
    return this.playlistModel
      .find({
        $or: [
          {
            createdBy: userId,
          },
          {
            isPublic: true,
          },
        ],
      })
      .populate('songs')
      .exec();
  }

  async findOne(id: Types.ObjectId, userId: Types.ObjectId): Promise<Playlist> {
    const playlist = await this.playlistModel
      .findById(id)
      .populate('songs')
      .populate('createdBy', 'name email');

    if (!playlist) throw new NotFoundException('Playlist not found');
    if (!playlist.isPublic && !playlist.createdBy.equals(userId)) {
      throw new BadRequestException('Accress Denied!');
    }
    return playlist;
  }

  async update(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Playlist> {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) throw new NotFoundException('Playlist not found');
    if (!playlist.createdBy.equals(userId)) {
      throw new ForbiddenException(
        'You are not authorized to update this playlist',
      );
    }
    Object.assign(playlist, updatePlaylistDto);
    return playlist.save();
  }

  async remove(id: Types.ObjectId, userId: Types.ObjectId) {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) throw new NotFoundException('Playlist not found');
    if (!playlist.createdBy.equals(userId)) {
      throw new ForbiddenException(
        'You are not authorized to delete this playlist',
      );
    }
    await this.playlistModel.findByIdAndDelete(id);
  }

  async addSong(
    playlistId: Types.ObjectId,
    userId: Types.ObjectId,
    addSongDto: AddSongDto,
  ): Promise<Playlist> {
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) throw new NotFoundException('Playlist not found');
    if (!playlist.createdBy.equals(userId)) {
      throw new ForbiddenException(
        'You are not authorized to modify this playlist',
      );
    }

    const song = await this.songModel.findById(addSongDto.songId);
    if (!song) throw new NotFoundException('Song not found');
    if (playlist.songs.includes(song._id)) {
      throw new BadRequestException('This song already exists in the playlist');
    }
    playlist.songs.push(song._id);
    await playlist.save();
    return playlist.populate('songs');
  }
}
