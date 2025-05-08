import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { unlinkSync } from 'fs';

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_NAME'),
      api_key: config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFromDisk(
    filePath: string,
    folder: string,
    resourceType: 'image' | 'video',
  ): Promise<UploadApiResponse> {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: resourceType,
      });

      try {
        unlinkSync(filePath);
      } catch (error) {
        console.warn(`Failed to delete file: ${filePath}`);
        console.warn(error);
      }

      return result;
    } catch (err) {
      const error = err as UploadApiErrorResponse;
      console.warn('Cloudinary upload failed', error);
      throw new InternalServerErrorException('File upload failed');
    }
  }
}
