/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuards } from 'src/auth/guards/roles.guard';
import { SongsService } from './songs.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/dto/create-user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { CreateSongDto } from './dto/create-song.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CurrentUserPayload } from 'src/auth/interfaces/current-user.interface';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller('songs')
@UseGuards(JwtAuthGuard, RoleGuards)
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @Roles(UserRole.ARTIST)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'audio', maxCount: 1 },
        { name: 'image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/songs',
          filename: (
            req: Express.Request,
            file: Express.Multer.File,
            cb: (error: Error | null, filename: string) => void,
          ) => {
            const ext = path.extname(file.originalname as string);
            cb(null, `${uuid()}${ext}`);
          },
        }),
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      audio?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
    @Body() createSongDto: CreateSongDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const audioFile = files.audio?.[0];
    if (!audioFile) throw new BadRequestException('Audio file is required');
    const imageFile = files.image?.[0];

    return this.songsService.create(
      createSongDto,
      user._id,
      audioFile.path as string,
      imageFile?.path as string,
    );
  }

  @Get()
  async findAll() {
    return this.songsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ARTIST)
  async update(
    @Param('id') id: string,
    @Body() updateSongDto: UpdateSongDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.songsService.update(id, updateSongDto, user._id);
  }

  @Delete(':id')
  @Roles(UserRole.ARTIST)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.songsService.remove(id, user._id);
  }
}
