import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * Create User Dto
 *
 * @export
 * @class UserCreateDto
 * @typedef {UserCreateDto}
 */
export class UserCreateDto {
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
 * User Update Dto
 *
 * @export
 * @class UserUpdateDto
 * @typedef {UserUpdateDto}
 * @extends {PartialType(UserCreateDto)}
 */
export class UserUpdateDto extends PartialType(UserCreateDto) {}


/**
 * user validate login
 *
 * @export
 * @class ValidateLoginDto
 * @typedef {ValidateLoginDto}
 */
export class UserValidateLoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  readonly password: string;
}
