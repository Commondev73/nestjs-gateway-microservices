import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { UserCreateDto, UserUpdateDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  /**
   * Creates a new user.
   *
   * @param userCreateDto User data to be stored.
   * @returns The created user.
   */
  async create(userCreateDto: UserCreateDto): Promise<User> {
    const user = {
      ...userCreateDto,
      password: await this.hashPassword(userCreateDto.password),
    }

    const createdUser = new this.userModel(user);
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

    if (!user) { 
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Retrieves a user by their username.
   *
   * @param username The user username.
   * @returns The user with the given username.
   */
  async findUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) { 
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  /**
   * Updates a user by their id.
   *
   * @param id The user id.
   * @param userUpdateDto User data to be updated.
   * @returns The updated user.
   */
  async update(id: string, userUpdateDto: UserUpdateDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, userUpdateDto, { new: true })
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

  /**
   * Hash Password
   *
   * @async
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
