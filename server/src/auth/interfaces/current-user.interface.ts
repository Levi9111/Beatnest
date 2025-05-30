import { Types } from 'mongoose';
import { UserRole } from 'src/users/schemas/users.const';

export interface CurrentUserPayload {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export interface SocialUser {
  providerId: string;
  email: string;
  name: string;
  provider: 'google' | 'facebook' | 'apple';
}
