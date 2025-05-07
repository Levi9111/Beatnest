import { IsEmail, IsEnum, MinLength } from 'class-validator';

export enum UserRole {
  USER = 'user',
  ARTIST = 'artist',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  // @IsStrongPassword()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
