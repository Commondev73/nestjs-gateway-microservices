import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto, AuthRefreshTokenDto } from './auth.dto';
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
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
   * @returns {Promise<AuthJwtToken>}
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() authLoginDto: AuthLoginDto): Promise<AuthJwtToken> {
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
   * @returns {Promise<AuthJwtToken>}
   */
  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refresh successful' })
  async refreshToken(
    @Body() authRefreshTokenDto: AuthRefreshTokenDto,
  ): Promise<AuthJwtToken> {
    const { refreshToken: oldRefreshToken } = authRefreshTokenDto;
    const tokens = await this.authService.refreshToken(oldRefreshToken);
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
