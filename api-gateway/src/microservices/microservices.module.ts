import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth',
          port: 3000,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroservicesModule {}
