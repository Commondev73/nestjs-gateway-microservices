import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('AUTH_MICROSERVICE') private readonly serviceA: ClientProxy) {}
  getHello(): string {
    return 'Hello World!';
  }
}
