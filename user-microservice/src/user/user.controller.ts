import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto, UserUpdateDto } from './user.dto';
import { UserWithoutPassword } from 'src/common/Interfaces/user.interface';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user_create')
  create(@Payload() userCreateDto: UserCreateDto): Promise<UserWithoutPassword> {
    return this.userService.create(userCreateDto);
  }

  @MessagePattern('user_find_all')
  findAll(): Promise<UserWithoutPassword[]> {
    return this.userService.findAll();
  }

  @MessagePattern('user_find_one')
  findOne(id: string): Promise<UserWithoutPassword> {
    return this.userService.findOne(id);
  }

  @MessagePattern('user_update')
  async update(@Payload() data: { id: string; userUpdateDto: UserUpdateDto }): Promise<UserWithoutPassword> {
    return this.userService.update(data.id, data.userUpdateDto);
  }

  @MessagePattern('user_delete')
  async delete(@Payload() id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
