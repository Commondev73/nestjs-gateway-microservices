import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determines whether the request is allowed to proceed or not.
   *
   * If the route is marked with the `@Public()` decorator, the authentication
   * is skipped and the request is allowed to proceed.
   *
   * Otherwise, the authentication is performed using the underlying
   * Passport.js strategy.
   *
   * @param context The execution context of the request.
   * @returns A boolean indicating whether the request is allowed to proceed.
   */
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  /**
   * Handles the result of the authentication process.
   *
   * @param err The error thrown by the underlying Passport.js strategy.
   * @param user The user object returned by the underlying Passport.js strategy.
   * @param info Additional information returned by the underlying Passport.js strategy.
   * @returns The user object if the authentication was successful, an exception otherwise.
   */
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
