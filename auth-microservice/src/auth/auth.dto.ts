import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * AuthL Register Dto
 *
 * @export
 * @class AuthLRegisterDto
 * @typedef {AuthLRegisterDto}
 */
export class AuthLRegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  readonly password: string;
}

/**
 * Auth Login Dto
 *
 * @export
 * @class AuthLoginDto
 * @typedef {AuthLoginDto}
 */
export class AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  readonly password: string;  
}

/**
 * Auth Refresh Token
 *
 * @export
 * @class AuthRefreshTokenDto
 * @typedef {AuthRefreshTokenDto}
 */
export class AuthRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string;
}