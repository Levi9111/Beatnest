import 'express';
import { JwtPayload } from 'jsonwebtoken';
declare module 'express' {
  export interface Request {
    user: JwtPayload;
    cookies: {
      refreshToken?: string;
      [key: string]: string | undefined;
    };
  }
}
