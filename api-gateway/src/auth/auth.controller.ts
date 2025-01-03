import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() body) {
    return await this.authService.registerUser(body);
  }

  @Public()
  @Post('login')
  async login(@Body() body, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(body);
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
    const { accessToken, refreshToken } =
      await this.authService.refreshToken(oldRefreshToken);
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
