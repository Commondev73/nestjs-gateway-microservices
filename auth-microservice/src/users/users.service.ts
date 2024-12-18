import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  /**
   * Creates a new user.
   *
   * @param createUserDto User data to be stored.
   * @returns The created user.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  /**
   * Retrieves all users.
   *
   * @returns Array of users.
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  
  /**
   * Retrieves a user by their id.
   *
   * @param id The user id.
   * @returns The user with the given id.
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }
  
  /**
   * Updates a user by their id.
   *
   * @param id The user id.
   * @param updateUserDto User data to be updated.
   * @returns The updated user.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    return user;
  }
  
  /**
   * Deletes a user by their id.
   *
   * @param id The user id.
   * @returns The deleted user.
   */
  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    return deletedUser;
  }
}
