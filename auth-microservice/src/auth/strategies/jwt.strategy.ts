import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => JwtStrategy.extractFromCookie(req, configService)
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // Extract Token from Cookie
  private static extractFromCookie(request: Request , configService: ConfigService) {
    let token = null;
    if (request && request.cookies) {
      token = request.cookies[configService.get<string>('COOKIE_ACCESS_TOKEN_NAME')];
    }
    return token;
  }

  // Validate User
  async validate(payload: any): Promise<any> {
    return { userId: payload.sub, username: payload.username };
  }
}
