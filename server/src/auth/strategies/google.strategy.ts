import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
import { SocialUser } from '../interfaces/current-user.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Record<string, unknown>,
    done: VerifyCallback,
  ) {
    const { id, emails, displayName } = profile as {
      id: string;
      emails: Record<string, string>[];
      displayName: string;
    };
    const user = {
      providerId: id,
      email: emails?.[0].value,
      name: displayName,
      provider: 'google',
    } as SocialUser;
    done(null, user);
  }
}
