import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/jwt/guards/jwt-auth.guard';
import { RoleGuards } from 'src/jwt/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './dto/create-user.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CurrentUserPayload } from 'src/auth/interfaces/current-user.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuards)
  @Roles(UserRole.ADMIN)
  async findAll() {
    const result = await this.usersService.getAllUsers();

    return {
      success: true,
      message: 'All users retireved successfully',
      data: result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuards)
  @Roles(UserRole.ADMIN, UserRole.ARTIST, UserRole.USER)
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findById(id);

    return {
      success: true,
      message: 'User retireved successfully',
      data: result,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuards)
  @Roles(UserRole.ADMIN, UserRole.ARTIST, UserRole.USER)
  async findByEmail(@Body() email: string) {
    const result = await this.usersService.findByEmail(email);

    return {
      success: true,
      message: 'User retireved successfully',
      data: result,
    };
  }

  @Patch('update-info')
  @UseGuards(JwtAuthGuard, RoleGuards)
  @Roles(UserRole.ADMIN, UserRole.ARTIST, UserRole.USER)
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateUserDto,
  ) {
    console.log(user);
    console.log(dto);
    const result = await this.usersService.updateUser(user.userId, dto);

    return {
      success: true,
      message: 'User information updated successfully',
      data: result,
    };
  }

  @Patch()
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.usersService.resetPassword(dto);

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }
}
