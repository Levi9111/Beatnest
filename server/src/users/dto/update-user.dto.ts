import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRole {
  USER = 'user',
  ARTIST = 'artist',
  ADMIN = 'admin',
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  provider: string;

  @IsString()
  @IsOptional()
  providerId: string;

  @MinLength(6)
  // @IsStrongPassword()
  @IsOptional()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
