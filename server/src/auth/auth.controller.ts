import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('signup')
  async sighup(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('Test');
    const { accessToken, refreshToken } = await this.authService.signup(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
    });

    return {
      accessToken,
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
    });

    return {
      accessToken,
    };
  }

  @Get('login/refresh-token')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.refreshToken as string;

    if (!refreshToken)
      throw new UnauthorizedException(
        'Unauthorized access. Refresh token not valid.',
      );
    return this.authService.generateRefreshToken(refreshToken);
  }
}
