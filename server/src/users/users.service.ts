import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private config: ConfigService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserDocument> {
    return await this.userModel.create(dto);
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    return user;
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    if (dto.userName) {
      if (!dto.userName.startsWith('@')) {
        dto.userName = `@${dto.userName}`;
      }
    }
    const updateUser = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updateUser) throw new NotFoundException('User not found');

    return updateUser;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { email, newPassword, otp } = dto;

    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new ForbiddenException('User not found!');
    }

    if (!user.otp || !(await bcrypt.compare(otp, user?.otp))) {
      throw new ForbiddenException('Unauthorized OTP access!');
    }

    if (new Date(user.otpExpiresAt) < new Date()) {
      throw new ForbiddenException('OTP has expired');
    }
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(this.config.get<string>('BCRYPT_SALT_ROUNDS')!),
    );

    user.password = hashedPassword;
    user.otp = null;
    await user.save({ validateBeforeSave: true });

    return {
      message: 'Password updated successfully',
    };
  }

  //   TODO: add soft delete functionality
  async deleteUser(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
