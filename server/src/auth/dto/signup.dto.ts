import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['user', 'artist'], { message: 'Role must be either user or artist' })
  role: 'user' | 'artist';
}
