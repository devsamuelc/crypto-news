import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SessionService } from '../session/session.service';
import * as bcrypt from 'bcrypt';
import { EnvConfiguration } from '@/env/env.configuration';

const env = EnvConfiguration.getInstance();

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || user.deletedAt) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException();

    return user;
  }

  async login(
    user: { id: string; email: string; role: string },
    userAgent?: string,
    ip?: string,
  ) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload, {
      secret: env.authentication.secret,
      expiresIn: '6h',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: env.authentication.refreshSecret,
      expiresIn: '7d',
    });

    await this.sessionService.create(user.id, refresh_token, userAgent, ip);

    return { access_token, refresh_token };
  }

  async refresh(refreshToken: string) {
    const session = await this.sessionService.findByToken(refreshToken);

    if (!session || new Date() > session.expiresAt) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: env.authentication.refreshSecret,
      });
    } catch (e) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    await this.sessionService.deleteByToken(refreshToken);

    return this.login(
      { id: payload.sub, email: payload.email, role: payload.role },
    );
  }

  async logout(refreshToken: string) {
    await this.sessionService.deleteByToken(refreshToken);
  }
}
