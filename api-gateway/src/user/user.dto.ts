import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Create User Dto
 *
 * @export
 * @class UserCreateDto
 * @typedef {UserCreateDto}
 */
export class UserCreateDto {
  @ApiProperty({
    example: 'name.lastname',
    description: 'The name of the user',
  })
  readonly name: string;

  @ApiProperty({ example: 'userTest', description: 'The username of the user' })
  readonly username: string;

  @ApiProperty({
    example: '123456789',
    description: 'The password of the user',
  })
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
export class UserUpdateDto extends PartialType(UserCreateDto) {
  @ApiPropertyOptional({
    example: 'newName.lastname',
    description: 'The updated name of the user',
  })
  readonly name?: string;
  @ApiPropertyOptional({
    example: 'newUserTest',
    description: 'The updated username of the user',
  })
  readonly username?: string;
  @ApiPropertyOptional({
    example: 'newPassword123',
    description: 'The updated password of the user',
  })
  readonly password?: string;
}
