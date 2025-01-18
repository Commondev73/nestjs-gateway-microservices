import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): Observable<any> {
    const { status, message } = this.getStatusAndMessage(exception);

    return throwError(() => ({
      status,
      message,
      timestamp: new Date().toISOString(),
    }));
  }

  private getStatusAndMessage(exception: unknown): { status: number, message: string } {
    let status: number;
    let message: string;

    switch (true) {
      case exception instanceof RpcException:
        const rpcError = (exception as RpcException).getError() as { message: string; status?: number };
        status = rpcError.status || HttpStatus.INTERNAL_SERVER_ERROR;
        message = rpcError.message || 'An RPC error occurred';
        break;

      case exception instanceof HttpException:
        status = (exception as HttpException).getStatus();
        message = (exception as HttpException).message;
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'An unknown error occurred';
    }

    return { status, message };
  }
}
