import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleGuards } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuards)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}
