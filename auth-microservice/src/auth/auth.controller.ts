import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './auth.dto';
import { UserCreateDto } from 'src/users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() userCreateDto: UserCreateDto) {
    await this.userService.create(userCreateDto);
    return { message: 'User registered successfully' };
  }

  /**
   * Login user
   *
   * @param authLoginBodyDto
   * @returns {Promise<{accessToken: string, refreshToken: string}>}
   */
  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    const { username, password } = authLoginDto;
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') oldRefreshToken: string) {
    const tokens = await this.authService.refreshToken(oldRefreshToken);
    return tokens;
  }
}
