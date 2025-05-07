import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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
    return this.genrateTokens(user._id as string, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new BadRequestException('User not found');
    if (!(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException('incorrect password');

    return this.genrateTokens(user._id as string, user.email, user.role);
  }

  async genrateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [access, refresh] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('ACCESS_TOKEN_EXPIRATION'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('REFRESH_TOKEN_EXPIRATION'),
      }),
    ]);

    return { accressToken: access, refreshToken: refresh };
  }
}
