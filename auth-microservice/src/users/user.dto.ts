import { PartialType } from '@nestjs/mapped-types';
import { Length } from 'class-validator';


/**
 * CreateUserDto
 *
 * @export
 * @class CreateUserDto
 * @typedef {CreateUserDto}
 */
export class CreateUserDto {
  @Length(1, 200)
  readonly name: string;

  @Length(1, 50)
  readonly username: number;

  @Length(1, 100)
  readonly password: string;
}


/**
 * UpdateUserDto
 *
 * @export
 * @class UpdateUserDto
 * @typedef {UpdateUserDto}
 * @extends {PartialType(CreateUserDto)}
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
