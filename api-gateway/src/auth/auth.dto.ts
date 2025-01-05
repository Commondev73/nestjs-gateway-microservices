import { ApiProperty } from "@nestjs/swagger";

/**
 * AuthL Register Dto
 *
 * @export
 * @class AuthRegisterDto
 * @typedef {AuthRegisterDto}
 */
export class AuthRegisterDto {
  @ApiProperty({ example: 'name.lastname', description: 'The name of the user' })
  readonly name: string;

  @ApiProperty({ example: 'userTest', description: 'The username of the user' })
  readonly username: string;

  @ApiProperty({ example: '123456789', description: 'The password of the user' })
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
  @ApiProperty({ example: 'userTest', description: 'The username of the user' })
  readonly username: string;

  @ApiProperty({ example: '123456789', description: 'The password of the user' })
  readonly password: string;  
}