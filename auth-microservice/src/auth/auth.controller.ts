import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './auth.dto';
import { UserCreateDto } from 'src/users/user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserWithoutPassword } from 'src/common/Interfaces/user.interface';
import { AuthJwtToken } from 'src/common/Interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create a new user
   *
   * @async
   * @param {UserCreateDto} userCreateDto
   * @returns {Promise<{ message: string }>}
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  async register(
    @Body() userCreateDto: UserCreateDto,
  ): Promise<{ message: string }> {
    await this.userService.create(userCreateDto);
    return { message: 'User registered successfully' };
  }

  /**
   * Login user
   *
   * @param authLoginBodyDto
   * @returns {Promise<{ message: string }>}
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(
    @Body() authLoginDto: AuthLoginDto,
    @Res({ passthrough: true }) res,
  ): Promise<{ message: string }> {
    const { username, password } = authLoginDto;

    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    this.authService.setCookie(res, this.configService.get<string>('COOKIE_ACCESS_TOKEN_NAME'), accessToken);
    this.authService.setCookie(res, this.configService.get<string>('COOKIE_REFRESH_TOKEN_NAME'), refreshToken);

    return { message: 'Logged in successfully' };
  }

  /**
   * Refresh token
   *
   * @async
   * @param {string} oldRefreshToken
   * @returns {Promise<AuthJwtToken>}
   */
  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refresh successful' })
  async refreshToken(
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<AuthJwtToken> {
    const oldRefreshToken = req.cookies['refreshToken'];

    const tokens = await this.authService.refreshToken(oldRefreshToken);

    this.authService.setCookie(res, this.configService.get<string>('COOKIE_ACCESS_TOKEN_NAME'), tokens.accessToken);
    this.authService.setCookie(res, this.configService.get<string>('COOKIE_REFRESH_TOKEN_NAME'), tokens.refreshToken);

    return tokens;
  }

  /**
   * Get profile
   *
   * @async
   * @param {*} req
   * @returns {Promise<UserWithoutPassword>}
   */
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile data' })
  async getProfile(@Req() req): Promise<UserWithoutPassword> {
    const userId = req.user.userId;
    return this.userService.findOne(userId);
  }
}
