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
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user.
   * @param createUserDto The user to create.
   * @returns The created user.
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Retrieves all users.
   * @returns The list of users.
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Retrieves a user by its ID.
   * @param params The request paramaters (contains the user ID).
   * @returns The user with the given ID.
   */
  @Get(':id')
  findOne(@Param() params) {
    return this.usersService.findOne(params.id);
  }

  /**
   * Updates an existing user by its ID.
   * @param params The request parameters (contains the user ID).
   * @param updateUserDto The user data to update.
   * @returns The updated user.
   */
  @Put(':id')
  update(@Param() params, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(params.id, updateUserDto);
  }

  /**
   * Deletes a user by its ID.
   * @param params The request parameters (contains the user ID).
   * @returns The deleted user.
   */
  @Delete(':id')
  delete(@Param() params) {
    return this.usersService.delete(params.id);
  }
}
