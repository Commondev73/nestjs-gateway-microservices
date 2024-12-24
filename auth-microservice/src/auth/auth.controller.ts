import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto, AuthLoginResponseDto } from './auth.dto';
import { UserCreateDto } from 'src/users/user.dto';
import { Public } from 'src/common/public.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/users/schema/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: Promise<{ message: string }>,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
   * @returns {Promise<AuthLoginResponseDto>}
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthLoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  async login(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<AuthLoginResponseDto> {
    
    const { username, password } = authLoginDto;

    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  /**
   * Refresh token
   *
   * @async
   * @param {string} oldRefreshToken
   * @returns {Promise<AuthLoginResponseDto>}
   */
  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Token refresh successful',
    type: AuthLoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  async refreshToken(
    @Body('refreshToken') oldRefreshToken: string,
  ): Promise<AuthLoginResponseDto> {
    try {
      const tokens = await this.authService.refreshToken(oldRefreshToken);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Get profile
   *
   * @async
   * @param {*} req
   * @returns {Promise<Partial<User>>}
   */
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile data', type: User })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  async getProfile(@Req() req): Promise<Partial<User>> {
    const userId = req.user.userId;
    return this.userService.findOne(userId);
  }
}
