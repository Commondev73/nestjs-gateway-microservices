import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto, AuthRegisterDto } from './auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: AuthRegisterDto })
  async register(@Body() body: AuthRegisterDto) {
    return await this.authService.registerUser(body);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: AuthLoginDto })
  async login(
    @Body() body: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
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
  @Get('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Req() req: Request,@Res({ passthrough: true }) res: Response) {
    const oldRefreshToken =
      req.cookies[
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
