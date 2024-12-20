import { IsNotEmpty, IsString, Length } from 'class-validator';

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
