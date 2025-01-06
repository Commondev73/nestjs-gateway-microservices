import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserCreateDto, UserUpdateDto } from './user.dto';

@ApiTags('User Service')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ description: 'User data', type: UserCreateDto })
  async create(@Body() body: UserCreateDto) {
    return await this.userService.create(body);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  async getAll() {
    return await this.userService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async getById(@Param('id') id: string) {
    return await this.userService.getById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ description: 'Updated user data', type: UserUpdateDto })
  async update(@Param('id') id: string, @Body() body: UserUpdateDto) {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
