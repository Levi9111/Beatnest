import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { SocialUser } from '../interfaces/current-user.interface';
import { Strategy } from 'passport-facebook';
import { VerifyCallback } from 'passport-oauth2';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get<string>('FACEBOOK_CLIENT_ID')!,
      clientSecret: config.get<string>('FACEBOOK_CLIENT_SECRET')!,
      callbackURL: config.get<string>('FACEBOOK_CALLBACK_URL')!,
      profileFields: ['id', 'email', 'name'],
      scope: ['email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Record<string, unknown>,
    done: VerifyCallback,
  ) {
    const { id, emails, name } = profile as {
      id: string;
      emails: Record<string, string>[];
      name: Record<string, string>;
    };
    const user = {
      providerId: id,
      email: emails?.[0].value,
      name: `${name.givenName} ${name.familyName}`,
      provider: 'facebook',
    } as SocialUser;
    done(null, user);
  }
}
