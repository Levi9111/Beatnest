import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuards } from 'src/auth/guards/roles.guard';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CurrentUserPayload } from 'src/auth/interfaces/current-user.interface';
import { Types } from 'mongoose';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddSongDto } from './dto/add-song.dto';

@Controller('playlists')
@UseGuards(JwtAuthGuard, RoleGuards)
export class PlaylistsController {
  constructor(private readonly playlistService: PlaylistsService) {}

  @Post()
  create(
    @Body() dto: CreatePlaylistDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.playlistService.create(dto, user._id);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.playlistService.findAll(user._id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: Types.ObjectId,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.playlistService.findOne(id, user._id);
  }

  @Patch('"id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() dto: UpdatePlaylistDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.playlistService.update(id, user._id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: Types.ObjectId,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.playlistService.remove(id, user._id);
  }

  @Post(':id/songs')
  addSong(
    @Param('id') playlistId: Types.ObjectId,
    @Body() dto: AddSongDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.playlistService.addSong(playlistId, user._id, dto);
  }

  @Post(':id/like')
  async likePlaylist(
    @Param('id') id: Types.ObjectId,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.playlistService.likePlaylist(id, user._id);
  }

  @Delete(':id/like')
  async unlikePlaylist(
    @Param('id') id: Types.ObjectId,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.playlistService.unlikePlaylist(id, user._id);
  }
}
