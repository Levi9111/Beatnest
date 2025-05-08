import { Types } from 'mongoose';
import { UserRole } from 'src/users/schemas/users.const';

export interface CurrentUserPayload {
  _id: Types.ObjectId;
  userId: string;
  email: string;
  role: UserRole;
}
