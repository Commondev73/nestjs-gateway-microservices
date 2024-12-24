import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto, UserUpdateDto } from './user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './schema/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user.
   *
   * @param {UserCreateDto} userCreateDto
   * @returns {Promise<Partial<User>[]>}
   */
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  create(@Body() userCreateDto: UserCreateDto): Promise<Partial<User>> {
    return this.usersService.create(userCreateDto);
  }

  /**
   * Retrieves all users.
   *
   * @returns {Promise<Partial<User>[]>}
   */
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All user data', type: [User] })
  findAll(): Promise<Partial<User>[]> {
    return this.usersService.findAll();
  }

  /**
   * Retrieves a user by its ID.
   *
   * @param {string} id
   * @returns {Promise<Partial<User>>}
   */
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'The user data', type: User })
  findOne(@Param('id') id: string): Promise<Partial<User>> {
    return this.usersService.findOne(id);
  }

  /**
   * Updates an existing user by its ID.
   *
   * @async
   * @param {string} id
   * @param {UserUpdateDto} userUpdateDto
   * @returns {Promise<Partial<User>>}
   */
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  async update(@Param('id') id: string, @Body() userUpdateDto: UserUpdateDto): Promise<Partial<User>> {
    return this.usersService.update(id, userUpdateDto);
  }

  /**
   * Deletes a user by its ID.
   *
   * @async
   * @param {string} id
   * @returns {Promise<void>}
   */
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
  }
}
