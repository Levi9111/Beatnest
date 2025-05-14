import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { SocialUser } from './interfaces/current-user.interface';
import { JwtAuthGuard } from 'src/jwt/guards/jwt-auth.guard';

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as SocialUser;

    const tokens = await this.authService.socialLogin(user);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
    });

    return res.redirect(
      `${this.config.get<string>('CLIENT_URL')}/oauth-success`,
    );
  }

  // Facebook OAuth
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as SocialUser;

    const tokens = await this.authService.socialLogin(user);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
    });

    return res.redirect(
      `${this.config.get<string>('CLIENT_URL')}/oauth-success`,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request) {
    return req.user;
  }
}
