import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { ClientKafka } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientKafka,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit() {
    this.authServiceClient.subscribeToResponseOf('validate_token');
    await this.authServiceClient.connect();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const accessToken =
      request.cookies[
        this.configService.get<string>('COOKIE_ACCESS_TOKEN_NAME')
      ];

    if (!accessToken) {
      throw new UnauthorizedException('No token provided');
    }

    return this.validateToken(accessToken);
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const isValid = await this.authServiceClient
        .send<boolean>('validate_token', accessToken)
        .toPromise();

      if (!isValid) {
        throw new UnauthorizedException('Invalid token');
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
