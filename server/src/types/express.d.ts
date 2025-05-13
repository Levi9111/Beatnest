import 'express';
declare module 'express' {
  export interface Request {
    cookies: {
      refreshToken?: string;
      [key: string]: string | undefined;
    };
  }
}
