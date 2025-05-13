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

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  provider: string;

  @IsString()
  @IsOptional()
  providerId: string;

  @MinLength(6)
  // @IsStrongPassword()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
