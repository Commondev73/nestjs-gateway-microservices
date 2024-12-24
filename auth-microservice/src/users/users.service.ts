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
   * Creates a new user in the database.
   *
   * Hashes the user's password and saves the user to the database.
   * Returns the created user with the password field removed.
   *
   * @param {UserCreateDto} userCreateDto - The data transfer object containing user information.
   * @returns {Promise<Partial<User>>} A promise that resolves to the created user object without the password.
   */
  async create(userCreateDto: UserCreateDto): Promise<Partial<User>> {
    const user = {
      ...userCreateDto,
      password: await this.hashPassword(userCreateDto.password),
    };

    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();

    return this.removePassword(savedUser.toObject());
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns {Promise<Partial<User>[]>} An array of users without their password fields.
   */
  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.removePassword(user.toObject()));
  }

  /**
   * Retrieves a user by their id.
   *
   * @param {string} id The user id.
   * @returns {Promise<Partial<User>>} The user with the given id without the password field.
   * @throws {NotFoundException} If no user is found.
   */
  async findOne(id: string): Promise<Partial<User>> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.removePassword(user.toObject());
  }

  /**
   * Retrieves a user by their username.
   *
   * @param {string} username The username of the user.
   * @returns {Promise<Partial<User>>} The user with the given username.
   * @throws {NotFoundException} If no user is found with the given username.
   */
  async findUsername(username: string): Promise<Partial<User>> {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.toObject();
  }

  /**
   * Updates a user's information.
   *
   * @param id The user id.
   * @param userUpdateDto The data to update the user with.
   * @returns {Promise<Partial<User>>} The updated user without the password field.
   * @throws {NotFoundException} If the user with the given id is not found.
   */
  async update(
    id: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<Partial<User>> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, userUpdateDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return this.removePassword(updatedUser.toObject());
  }

  /**
   * Deletes a user by their id.
   *
   * @param {string} id The user id.
   * @returns {Promise<void>} A promise that resolves when the user is deleted.
   * @throws {NotFoundException} If no user is found with the given id.
   */
  async delete(id: string): Promise<void> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
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
   * @returns {Partial<User>} The user object with the password removed.
   * @private
   */
  private removePassword(user: User): Partial<User> {
    const { password, ...result } = user;
    return result;
  }
}
