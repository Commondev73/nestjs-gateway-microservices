import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientKafka,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.authServiceClient.subscribeToResponseOf('auth_register');
    this.authServiceClient.subscribeToResponseOf('auth_login');
    this.authServiceClient.subscribeToResponseOf('auth_refresh_token');
    await this.authServiceClient.connect();
  }

  @Public()
  @Post('register')
  async register(@Body() body) {
    return this.authServiceClient.send('auth_register', body);
  }

  @Public()
  @Post('login')
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authServiceClient
      .send('login', body)
      .toPromise();

    this.authService.setCookie(
      res,
      this.configService.get<string>('COOKIE_ACCESS_TOKEN_NAME'),
      accessToken,
    );
    this.authService.setCookie(
      res,
      this.configService.get<string>('COOKIE_REFRESH_TOKEN_NAME'),
      refreshToken,
    );

    return { message: 'Logged in successfully' };
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Res({ passthrough: true }) res: Response) {
    const oldRefreshToken =
      res.req.cookies[
        this.configService.get<string>('COOKIE_REFRESH_TOKEN_NAME')
      ];

    const { accessToken, refreshToken } = await this.authServiceClient
      .send('auth_refresh_token', { oldRefreshToken })
      .toPromise();

    this.authService.setCookie(
      res,
      this.configService.get<string>('COOKIE_ACCESS_TOKEN_NAME'),
      accessToken,
    );

    this.authService.setCookie(
      res,
      this.configService.get<string>('COOKIE_REFRESH_TOKEN_NAME'),
      refreshToken,
    );

    return { message: 'Token refreshed' };
  }
}
