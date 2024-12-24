import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsString, Length } from 'class-validator';


/**
 * Create User Dto
 *
 * @export
 * @class UserCreateDto
 * @typedef {UserCreateDto}
 */
export class UserCreateDto {
  @ApiProperty({ example: 'name.lastname', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  readonly name: string;

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
 * User Update Dto
 *
 * @export
 * @class UserUpdateDto
 * @typedef {UserUpdateDto}
 * @extends {PartialType(UserCreateDto)}
 */
export class UserUpdateDto extends PartialType(UserCreateDto) {}
