import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const replyTopics = ['user_create', 'user_find_one'];

    replyTopics.forEach((topic) =>
      this.userServiceClient.subscribeToResponseOf(topic),
    );

    await this.userServiceClient.connect();
  }

  async create(body: any) {
    return await this.userServiceClient.send('user_create', body);
  }

  async getAll() {
    return await this.userServiceClient.send('user_find_all', {});
  }

  async getById(id: string) {
    return await this.userServiceClient.send('user_find_one', id);
  }

  async update(id: string, body: any) {
    return await this.userServiceClient.send('user_update', { id, ...body });
  }

  async delete(id: string) {
    return await this.userServiceClient.send('user_delete', id);
  }
}
