import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name : 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [configService.get<string>('KAFKA_BROKER')],
            },
            consumer: {
              groupId: configService.get<string>('KAFKA_GROUP_ID'),
            },
          }
        }),
        inject: [ConfigService],
      }
    ])
  ],
  exports: [ClientsModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
