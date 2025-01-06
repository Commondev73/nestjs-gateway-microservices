import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AuthLoginDto, AuthRegisterDto } from './auth.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const replyTopics = ['auth_register', 'auth_login', 'auth_refresh_token'];

    replyTopics.forEach((topic) =>
      this.authServiceClient.subscribeToResponseOf(topic),
    );

    await this.authServiceClient.connect();
  }

  async registerUser(body: AuthRegisterDto) {
    return await firstValueFrom(
      this.authServiceClient.send('auth_register', body),
    );
  }
  async loginUser(body: AuthLoginDto) {
    return await firstValueFrom(
      this.authServiceClient.send('auth_login', body),
    );
  }
  async refreshToken(oldRefreshToken: string) {
    return await firstValueFrom(
      this.authServiceClient.send('auth_refresh_token', {
        refreshToken: oldRefreshToken,
      }),
    );
  }
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
