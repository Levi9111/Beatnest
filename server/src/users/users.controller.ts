import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/jwt/guards/jwt-auth.guard';
import { RoleGuards } from 'src/jwt/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RoleGuards)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}
