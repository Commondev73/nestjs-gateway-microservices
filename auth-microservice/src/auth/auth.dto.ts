import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * Auth Login Dto
 *
 * @export
 * @class AuthLoginDto
 * @typedef {AuthLoginDto}
 */
export class AuthLoginDto {
  @ApiProperty({ example: 'userTest', description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  readonly username: string;

  @ApiProperty({ example: '123456789', description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  readonly password: string;  
}

/**
 * Auth Refresh Token Dto
 *
 * @export
 * @class AuthRefreshTokenDto
 * @typedef {AuthRefreshTokenDto}
 */
export class AuthRefreshTokenDto {
  @ApiProperty({ example: 'refreshToken', description: 'The refresh token of the user' })
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string;
}

/**
 * Auth Login Response Dto
 *
 * @export
 * @class AuthLoginResponseDto
 * @typedef {AuthLoginResponseDto}
 */
export class AuthLoginResponseDto {
  @ApiProperty({ example: 'accessToken', description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ example: 'refreshToken', description: 'JWT Refresh Token' })
  refreshToken: string;
}
