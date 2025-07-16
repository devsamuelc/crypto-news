import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt/jwt.auth.guard';
import { Authentication } from '@/auth/decorators/auth.decorator';
import { IAuthentication } from '@/auth/entities/authentication';

@ApiTags('Sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async findAll(@Authentication() authentication: IAuthentication) {
    const { userId } = authentication;

    return this.sessionService.findAllByUser(userId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteSession(
    @Authentication() authentication: IAuthentication,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const { userId } = authentication;

    const sessions = await this.sessionService.findAllByUser(userId);
    const ownsSession = sessions.some((s) => s.id === id);

    if (!ownsSession) {
      throw new ForbiddenException('Unauthorized session delete');
    }

    await this.sessionService.deleteById(id);
  }

  @Delete()
  @HttpCode(204)
  async deleteAll(@Authentication() authentication: IAuthentication) {
    const { userId } = authentication;

    await this.sessionService.deleteAllByUser(userId);
  }
}
