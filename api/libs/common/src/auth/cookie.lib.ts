import { Response, Request } from 'express';
import * as process from 'node:process';

export const cookieFactory = (res: Response, req: Request) => {
  const get = (name: string) => {
    const value = (req.cookies as Record<string, unknown>)[name];
    return typeof value === 'string' ? value : undefined;
  };

  const set = (name: string, value: string, exp?: number) => {
    res.cookie(name, value, {
      httpOnly: true,
      secure: process.env.MODE !== 'dev',
      maxAge: exp ? exp : 1000 * 60 * 60 * 24,
    });
  };

  const remove = (name: string) => {
    res.clearCookie(name);
  };

  return {
    get,
    set,
    remove,
  };
};
