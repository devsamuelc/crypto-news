/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenUtils } from '@/utils/Token.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  public constructor(private readonly jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = (request.headers['authorization'] ||
      request.headers['Authorization']) as string | undefined;

    const token = TokenUtils.extractBearerToken(authHeader);

    if (!token) {
      throw new UnauthorizedException('No token provided.');
    }

    try {
      const payload = this.jwtService.decode(token);

      payload.userId = payload.sub!;

      request['auth'] = payload;
    } catch (error) {
      throw new UnauthorizedException('JWT expired.');
    }

    return true;
  }
}
