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
import { transporter } from 'src/utils/transporter.email';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verrify-otp.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userService: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: CreateUserDto) {
    const existing = (await this.userService.findByEmail(
      dto.email,
    )) as UserDocument;
    if (existing) {
      if (existing.isAuthenticated) {
        throw new ConflictException('Email already registered!');
      } else {
        await this.generateOtp({ email: dto.email });
        return {
          message:
            'User already exists but not verified. OTP resent to the email.',
        };
      }
    }

    const hashed = await bcrypt.hash(
      dto.password,
      Number(this.config.get<string>('BCRYPT_SALT_ROUNDS')!),
    );

    const user = await this.userService.createUser({
      ...dto,
      password: hashed,
    });
    return this.genrateTokens(
      user._id as string,
      user.name,
      user.userName,
      user.email,
      user.role,
      user.isAuthenticated,
    );
  }

  async generateOtp(dto: GenerateOtpDto) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(
      otp,
      Number(this.config.get<string>('BCRYPT_SALT_ROUNDS')!),
    );

    await transporter().sendMail({
      from: this.config.get<string>('beatnest.team@gmail.com'),
      to: dto.email,
      subject: 'Your Email verification code.',
      html: `<p>Your Beatnest email verification code is: <b>${otp}</b></p>`,
    });

    await this.userModel.findOneAndUpdate(
      { email: dto.email },
      {
        otp: hashedOtp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    );
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new NotFoundException('User not found');
    if (!user.otp) throw new UnauthorizedException('Otp not found');

    const isOtpValid = await bcrypt.compare(dto.otp, user.otp);
    const isOtpExpired = new Date(user.otpExpiresAt).getTime() < Date.now();

    if (!user.otpExpiresAt || !isOtpValid || isOtpExpired)
      throw new UnauthorizedException('Invalid or expired OTP');

    const updatedUser = (await this.userModel.findOneAndUpdate(
      { email: dto.email },
      {
        isAuthenticated: true,
        otp: null,
        otpExpiresAt: null,
      },
      {
        new: true,
        runValidators: true,
      },
    )) as UserDocument;

    return this.genrateTokens(
      updatedUser._id as string,
      updatedUser.name,
      updatedUser.userName,
      updatedUser.email,
      updatedUser.role,
      updatedUser.isAuthenticated,
    );
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) throw new BadRequestException('User not found');

    if (!(await bcrypt.compare(dto.password, user.password)))
      throw new UnauthorizedException('incorrect password');

    return this.genrateTokens(
      user._id as string,
      user.name,
      user.userName,
      user.email,
      user.role,
      user.isAuthenticated,
    );
  }

  genrateTokens(
    userId: string,
    name: string,
    userName: string,
    email: string,
    role: string,
    isAuthenticated: boolean,
  ) {
    const payload = { userId, name, userName, email, role, isAuthenticated };

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
      name: user.name,
      userName: user.userName,
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
      user.name,
      user.userName,
      user.email,
      user.role,
      user.isAuthenticated,
    );
  }
}
