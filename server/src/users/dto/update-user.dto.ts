import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from './create-user.dto';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  likedGenres?: string[];

  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  providerId?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  otp?: string | null;

  @IsDateString()
  @IsOptional()
  otpExpiresAt?: string | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  purchasedSongs?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  likedPlaylists?: string[]; // Array of Playlist IDs

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  followingArtists?: string[]; // Array of User IDs

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  likedSongs?: string[]; // Array of Song IDs

  @IsBoolean()
  @IsOptional()
  isAuthenticated?: boolean;
}
