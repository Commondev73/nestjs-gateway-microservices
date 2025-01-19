import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto, UserUpdateDto, UserValidateLoginDto } from './user.dto';
import { UserWithoutPassword } from 'src/common/Interfaces/user.interface';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user_create')
  async create(
    @Payload() userCreateDto: UserCreateDto,
  ): Promise<UserWithoutPassword> {
    return await this.userService.create(userCreateDto);
  }

  @MessagePattern('user_find_all')
  async findAll(): Promise<UserWithoutPassword[]> {
    return await this.userService.findAll();
  }

  @MessagePattern('user_find_one')
  async findOne(@Payload() id: string): Promise<UserWithoutPassword> {
    return await this.userService.findOne(id);
  }

  @MessagePattern('user_validate_login')
  async validateLogin(
    @Payload() userValidateLoginDto: UserValidateLoginDto,
  ): Promise<UserWithoutPassword> {
    const { username, password } = userValidateLoginDto;
    return await this.userService.validateUser(username, password);
  }

  @MessagePattern('user_update')
  async update(
    @Payload() data: { id: string } & UserUpdateDto,
  ): Promise<UserWithoutPassword> {
    return await this.userService.update(data.id, data);
  }

  @MessagePattern('user_delete')
  async delete(@Payload() id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
