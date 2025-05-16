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

@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuards)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    const result = await this.usersService.getAllUsers();

    return {
      success: true,
      message: 'All users retireved successfully',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findById(id);

    return {
      success: true,
      message: 'User retireved successfully',
      data: result,
    };
  }

  @Post()
  async findByEmail(@Body() email: string) {
    const result = await this.usersService.findByEmail(email);

    return {
      success: true,
      message: 'User retireved successfully',
      data: result,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const result = await this.usersService.updateUser(id, dto);

    return {
      success: true,
      message: 'User information updated successfully',
      data: result,
    };
  }
}
