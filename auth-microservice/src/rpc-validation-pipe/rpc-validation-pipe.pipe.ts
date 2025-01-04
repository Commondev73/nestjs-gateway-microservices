import { Injectable, ArgumentMetadata, BadRequestException, ValidationPipe, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ValidationError } from 'class-validator';

@Injectable()
export class RpcValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      if (error instanceof BadRequestException) {
        const response = error.getResponse() as {
          message: string | ValidationError[];
        };

        throw new RpcException({ message: response.message, status: HttpStatus.BAD_REQUEST });
      }
      throw error;
    }
  }
}
