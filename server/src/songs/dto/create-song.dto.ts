import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}
