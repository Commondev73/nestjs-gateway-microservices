import * as bcrypt from 'bcrypt';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { UserCreateDto, UserUpdateDto } from './user.dto';
import { UserWithoutPassword } from 'src/common/Interfaces/user.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Creates a new user in the database.
   *
   * Hashes the user's password and saves the user to the database.
   * Returns the created user with the password field removed.
   *
   * @param {UserCreateDto} userCreateDto - The data transfer object containing user information.
   * @returns {Promise<UserWithoutPassword>} A promise that resolves to the created user object without the password.
   */
  async create(userCreateDto: UserCreateDto): Promise<UserWithoutPassword> {
    try {
      const user = {
        ...userCreateDto,
        password: await this.hashPassword(userCreateDto.password),
      };

      const createdUser = new this.userModel(user);
      const savedUser = await createdUser.save();

      return this.removePassword(savedUser.toObject());
    } catch (error) {
      throw new RpcException({
        message: 'Failed to create user',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns {Promise<UserWithoutPassword[]>} An array of users without their password fields.
   */
  async findAll(): Promise<UserWithoutPassword[]> {
    try {
      const users = await this.userModel.find().exec();
      return users.map((user) => this.removePassword(user.toObject()));
    } catch (error) {
      throw new RpcException({
        message: 'Failed to retrieve users',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Retrieves a user by their id.
   *
   * @param {string} id The user id.
   * @returns {Promise<UserWithoutPassword>} The user with the given id without the password field.
   * @throws {NotFoundException} If no user is found.
   */
  async findOne(id: string): Promise<UserWithoutPassword> {
    try {
      const user = await this.userModel.findById(id).exec();

      if (!user) {
        throw new RpcException({
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        });
      }

      return this.removePassword(user.toObject());
    } catch (error) {
      throw new RpcException({
        message: 'Failed to find user',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Validate User login
   *
   * @async
   * @param {string} username
   * @param {string} password
   * @returns {Promise<UserWithoutPassword>}
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    try {
      const user = await this.userModel.findOne({ username }).exec();

      if (!user) {
        throw new RpcException({
          message: 'Invalid credentials',
          status: HttpStatus.NOT_FOUND,
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new RpcException({
          message: 'Invalid credentials',
          status: HttpStatus.NOT_FOUND,
        });
      }

      return this.removePassword(user.toObject());
    } catch (error) {
      throw new RpcException({
        message: 'Failed to validate user',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Updates a user's information.
   *
   * @param id The user id.
   * @param userUpdateDto The data to update the user with.
   * @returns {Promise<UserWithoutPassword>} The updated user without the password field.
   * @throws {RpcException} If the user with the given id is not found.
   */
  async update(
    id: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<UserWithoutPassword> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, userUpdateDto, { new: true })
        .exec();

      if (!updatedUser) {
        throw new RpcException({
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        });
      }

      return this.removePassword(updatedUser.toObject());
    } catch (error) {
      throw new RpcException({
        message: 'Failed to update user',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  /**
   * Deletes a user by their id.
   *
   * @param {string} id The user id.
   * @returns {Promise<void>} A promise that resolves when the user is deleted.
   * @throws {RpcException} If no user is found with the given id.
   */
  async delete(id: string): Promise<void> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

      if (!deletedUser) {
        throw new RpcException({
          message: 'User not found',
          status: HttpStatus.NOT_FOUND,
        });
      }
    } catch (error) {
      throw new RpcException({
        message: 'Failed to delete user',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
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

  /**
   * Removes the password field from a user object.
   *
   * @param {User} user The user object to remove the password from.
   * @returns {UserWithoutPassword} The user object with the password removed.
   * @private
   */
  private removePassword(user: User): UserWithoutPassword {
    const { password, ...result } = user;
    return result;
  }
}
