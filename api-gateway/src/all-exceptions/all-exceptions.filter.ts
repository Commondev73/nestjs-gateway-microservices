import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    console.log('exception', exception instanceof RpcException);
    switch (true) {
      case exception instanceof BadRequestException:
        status = 400;
        message = (exception as BadRequestException).message;
        break;
      case exception instanceof UnauthorizedException:
        status = 401;
        message = (exception as UnauthorizedException).message;
        break;
      case exception instanceof NotFoundException:
        status = 404;
        message = (exception as NotFoundException).message;
        break;
      case exception instanceof HttpException:
        status = (exception as HttpException).getStatus();
        message = (exception as HttpException).message;
        break;
      default:
        const getError = exception as {
          message: string;
          status?: number;
        };
        status = getError.status || 500;
        message = getError.message || 'Internal server error';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
