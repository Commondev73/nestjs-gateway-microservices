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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserWithoutPassword } from 'src/common/Interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user.
   *
   * @param {UserCreateDto} userCreateDto
   * @returns {Promise<UserWithoutPassword>}
   */
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  create(@Body() userCreateDto: UserCreateDto): Promise<UserWithoutPassword> {
    return this.usersService.create(userCreateDto);
  }

  /**
   * Retrieves all users.
   *
   * @returns {Promise<Partial<UserWithoutPassword>[]>}
   */
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All user data' })
  findAll(): Promise<Partial<UserWithoutPassword>[]> {
    return this.usersService.findAll();
  }

  /**
   * Retrieves a user by its ID.
   *
   * @param {string} id
   * @returns {Promise<UserWithoutPassword>}
   */
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiQuery({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'The user data' })
  findOne(@Param('id') id: string): Promise<UserWithoutPassword> {
    return this.usersService.findOne(id);
  }

  /**
   * Updates an existing user by its ID.
   *
   * @async
   * @param {string} id
   * @param {UserUpdateDto} userUpdateDto
   * @returns {Promise<UserWithoutPassword>}
   */
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiQuery({ name: 'id', required: true})
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<UserWithoutPassword> {
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
  @ApiQuery({ name: 'id', required: true })
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
  }
}
