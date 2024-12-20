import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';

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
   * @param {User} user
   * @returns {Promise<string>}
   */
  async generateAccessToken(user: User): Promise<string> {
    const payload = { username: user.name, sub: user._id };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES'),
    });
  }

  /**
   * Generate Refresh Token
   *
   * @async
   * @param {User} user
   * @returns {Promise<string>}
   */
  async generateRefreshToken(user: User): Promise<string> {
    const payload = { username: user.name, sub: user._id };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'),
    });
  }

  async refreshToken(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.jwtService.verify(oldRefreshToken);
    const user = await this.userServive.findOne(payload.sub);
    if (user) {
      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);
      return { accessToken, refreshToken };
    } else {
      throw new Error('Invalid refresh token');
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
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userServive.findUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
