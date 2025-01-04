import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtToken, AuthUser } from 'src/common/Interfaces/auth.interface';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthLoginDto, AuthLRegisterDto } from './auth.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientKafka,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const replyTopics = ['user_create', 'user_validate_login'];

    replyTopics.forEach((topic) =>
      this.userServiceClient.subscribeToResponseOf(topic),
    );

    await this.userServiceClient.connect();
  }

  /**
   * Generate Access Token
   *
   * @async
   * @param {AuthUser} user
   * @returns {Promise<string>}
   */
  async generateAccessToken(user: AuthUser): Promise<string> {
    try {
      const payload = { username: user.name, sub: user._id };
      return this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES'),
      });
    } catch (error) {
      throw new RpcException('Failed to generate token');
    }
  }

  /**
   * Generate Refresh Token
   *
   * @async
   * @param {AuthUser} user
   * @returns {Promise<string>}
   */
  async generateRefreshToken(user: AuthUser): Promise<string> {
    try {
      const payload = { username: user.name, sub: user._id };
      return this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'),
      });
    } catch (error) {
      throw new RpcException('Failed to generate refresh token');
    }
  }

  /**
   * Generate Access and Refresh Token
   *
   * @async
   * @param {string} oldRefreshToken
   * @returns {Promise<AuthJwtToken>}
   */
  async refreshToken(oldRefreshToken: string): Promise<AuthJwtToken> {
    try {
      const payload = this.jwtService.verify(oldRefreshToken);

      const user = await firstValueFrom<AuthUser>(
        this.userServiceClient.send('user_find_one', payload.sub),
      );

      if (!user) {
        throw new RpcException('Invalid refresh token');
      }

      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);

      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException('Failed to refresh token');
    }
  }

  /**
   * Register
   *
   * @async
   * @param {AuthLRegisterDto} authLRegisterDto
   * @returns {Promise<AuthUser>}
   */
  async register(authLRegisterDto: AuthLRegisterDto): Promise<AuthUser> {
    try {
      const newUser = await firstValueFrom<AuthUser>(
        this.userServiceClient.send('user_create', authLRegisterDto),
      );
      return newUser;
    } catch (error) {
      throw new RpcException('Failed to register user');
    }
  }

  /**
   * Validate User
   *
   * @async
   * @param {AuthLoginDto} authLoginDto
   * @returns {Promise<AuthUser>}
   */
  async validateUser(authLoginDto: AuthLoginDto): Promise<AuthUser> {
    try {
      const user = await firstValueFrom<AuthUser>(
        this.userServiceClient.send('user_validate_login', authLoginDto),
      );
      return user;
    } catch (error) {
      throw new RpcException('Failed to validate user');
    }
  }

  /**
   * Validate Token
   *
   * @async
   * @param {string} token
   * @returns {Promise<boolean>}
   */
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(accessToken);
      return !!decoded;
    } catch (error) {
      return false;
    }
  }
}
