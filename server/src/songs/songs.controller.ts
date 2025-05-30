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
import { SongsService } from './songs.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/dto/create-user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CreateSongDto } from './dto/create-song.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CurrentUserPayload } from 'src/auth/interfaces/current-user.interface';
import { UpdateSongDto } from './dto/update-song.dto';
import { UploadService } from 'src/upload/upload.service';
import { JwtAuthGuard } from 'src/jwt/guards/jwt-auth.guard';
import { RoleGuards } from 'src/jwt/guards/roles.guard';

@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly cloudinaryService: UploadService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuards)
  @Roles(UserRole.ARTIST, UserRole.USER)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'audio', maxCount: 1 },
        { name: 'image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const folder = file.fieldname === 'audio' ? 'songs' : 'covers';
            cb(null, `uploads/${folder}`);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = [
            'audio/mpeg',
            'audio/wav',
            'image/jpeg',
            'image/png',
            'image/webp',
          ];

          if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
              new Error('Invalid file type. Only image and audio allowed'),
              false,
            );
          }

          cb(null, true);
        },
        limits: {
          fileSize: 15 * 1024 * 1024, // 15MB
        },
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
    if (!imageFile) throw new BadRequestException('Image file is required');

    // Upload to cloudinary
    const audioUpload = await this.cloudinaryService.uploadFromDisk(
      audioFile.path,
      'uploads/songs',
      'video',
    );

    const imageUpload = await this.cloudinaryService.uploadFromDisk(
      imageFile.path,
      'uploads/covers',
      'image',
    );

    return this.songsService.create(
      createSongDto,
      user.userId,
      audioUpload.secure_url,
      imageUpload.secure_url,
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
