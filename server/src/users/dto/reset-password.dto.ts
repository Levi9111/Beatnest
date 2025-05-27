import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  email: string;

  @IsString()
  newPassword: string;

  @IsString()
  otp: string;
}
