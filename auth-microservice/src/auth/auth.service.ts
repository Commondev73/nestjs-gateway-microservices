import * as bcrypt from 'bcrypt';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { UserWithoutPassword } from 'src/common/Interfaces/user.interface';
import { AuthJwtToken } from 'src/common/Interfaces/auth.interface';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userServive: UsersService,
  ) {}

  /**
   * Generate Access Token
   *
   * @async
   * @param {UserWithoutPassword} user
   * @returns {Promise<string>}
   */
  async generateAccessToken(user: UserWithoutPassword): Promise<string> {
    try {
      const payload = { username: user.name, sub: user._id };
      return this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES'),
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate token');
    }
  }

  /**
   * Generate Refresh Token
   *
   * @async
   * @param {UserWithoutPassword} user
   * @returns {Promise<string>}
   */
  async generateRefreshToken(user: UserWithoutPassword): Promise<string> {
    try {
      const payload = { username: user.name, sub: user._id };
      return this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate refresh token',
      );
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
      const user = await this.userServive.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);

      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to refresh token');
    }
  }

  /**
   * Validate User
   *
   * @async
   * @param {string} username
   * @param {string} password
   * @returns {Promise<User | null>}
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User> | null> {
    try {
      const user = await this.userServive.findUsername(username);

      const checkPass = await bcrypt.compare(password, user.password);

      if (!user || !checkPass) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to validate user');
    }
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
