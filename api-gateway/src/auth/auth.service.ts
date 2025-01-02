import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthService {
  /**
   * Set Cookie
   *
   * @param {Response} res
   * @param {string} cookieName
   * @param {string} cookieValue
   */
  setCookie(res: Response, cookieName: string, cookieValue: string): void {
    res.cookie(cookieName, cookieValue, { httpOnly: true, secure: true });
  }
}
