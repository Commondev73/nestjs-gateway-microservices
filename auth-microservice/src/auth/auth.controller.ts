import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthLoginDto,
  AuthLRegisterDto,
  AuthRefreshTokenDto,
} from './auth.dto';
import { AuthJwtToken, AuthUser } from 'src/common/Interfaces/auth.interface';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth_register')
  async register(
    @Payload() authLRegisterDto: AuthLRegisterDto,
  ): Promise<AuthUser> {
    const user = await this.authService.register(authLRegisterDto);
    return user;
  }

  @MessagePattern('auth_login')
  async login(@Payload() authLoginDto: AuthLoginDto): Promise<AuthJwtToken> {
    const user = await this.authService.validateUser(authLoginDto);

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  @MessagePattern('auth_refresh_token')
  async refreshToken(
    @Payload() authRefreshTokenDto: AuthRefreshTokenDto,
  ): Promise<AuthJwtToken> {
    const { refreshToken } = authRefreshTokenDto;

    const tokens = await this.authService.refreshToken(refreshToken);

    return tokens;
  }
}
