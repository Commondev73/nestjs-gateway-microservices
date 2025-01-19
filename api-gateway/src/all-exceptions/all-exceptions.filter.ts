import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.getStatusAndMessage(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private getStatusAndMessage(exception: unknown): {
    status: number;
    message: string;
  } {
    let status: number;
    let message: string;

    switch (true) {
      case exception instanceof BadRequestException:
        status = HttpStatus.BAD_REQUEST;
        message = (exception as BadRequestException).message;
        break;

      case exception instanceof UnauthorizedException:
        status = HttpStatus.UNAUTHORIZED;
        message = (exception as UnauthorizedException).message;
        break;

      case exception instanceof NotFoundException:
        status = HttpStatus.NOT_FOUND;
        message = (exception as NotFoundException).message;
        break;

      case exception instanceof HttpException:
        status = (exception as HttpException).getStatus();
        message = (exception as HttpException).message;
        break;
        
      default:
        const defaultError = exception as { message: string; status?: number };
        status = defaultError.status || HttpStatus.INTERNAL_SERVER_ERROR;
        message = defaultError.message || 'Internal server error';
    }

    return { status, message };
  }
}
