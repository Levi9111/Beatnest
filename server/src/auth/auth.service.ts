import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, UserRole } from 'src/users/dto/create-user.dto';
import { generateToken, verifyToken } from 'src/jwt/jwt.utils';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: CreateUserDto) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.createUser({
      ...dto,
      password: hashed,
    });
    return this.genrateTokens(
      user._id as string,
      user.email,
      user.role,
      user.isAuthenticated,
    );
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) throw new BadRequestException('User not found');

    if (!(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException('incorrect password');

    return this.genrateTokens(
      user._id as string,
      user.email,
      user.role,
      user.isAuthenticated,
    );
  }

  genrateTokens(
    userId: string,
    email: string,
    role: string,
    isAuthenticated: boolean,
  ) {
    const payload = { userId, email, role, isAuthenticated };

    const accessToken = generateToken(
      payload,
      this.config.get<string>('JWT_ACCESS_SECRET')!,
      this.config.get<string>('ACCESS_TOKEN_EXPIRATION')!,
    );

    const refreshToken = generateToken(
      payload,
      this.config.get<string>('JWT_REFRESH_SECRET')!,
      this.config.get<string>('REFRESH_TOKEN_EXPIRATION')!,
    );

    return { accessToken, refreshToken };
  }

  async generateRefreshToken(token: string) {
    const decoded = verifyToken(
      token,
      this.config.get<string>('JWT_REFRESH_SECRET')!,
    );
    const { userId } = decoded as Record<string, string>;

    const user = await this.userService.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    const jwtPayload = {
      userId: user._id as string,
      email: user.email,
      role: user.role,
      isAuthenticated: user.isAuthenticated,
    };
    const accessToken = generateToken(
      jwtPayload,
      this.config.get<string>('JWT_ACCESS_SECRET')!,
      this.config.get<string>('ACCESS_TOKEN_EXPIRATION')!,
    );

    return {
      accessToken,
    };
  }

  async socialLogin(oauthUser: {
    providerId: string;
    email: string;
    name: string;
    provider: string;
  }) {
    let user = await this.userService.findByEmail(oauthUser.email);

    if (!user) {
      user = await this.userService.createUser({
        email: oauthUser.email,
        name: oauthUser.name,
        provider: oauthUser.provider,
        providerId: oauthUser.providerId,
        password: '',
        isAuthenticated: true,
        role: UserRole.USER,
      });
    }
    return this.genrateTokens(
      user._id as string,
      user.email,
      user.role,
      user.isAuthenticated,
    );
  }
}
