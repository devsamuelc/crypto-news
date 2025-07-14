import {
  Controller,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtStrategy } from '@/auth/jwt/jwt.strategy';

@ApiTags('Sessions')
@UseGuards(JwtStrategy)
@ApiBearerAuth()
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  async findAll(@Req() req) {
    return this.sessionService.findAllByUser(req.user.userId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteSession(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const sessions = await this.sessionService.findAllByUser(req.user.userId);
    const ownsSession = sessions.some((s) => s.id === id);

    if (!ownsSession) {
      throw new ForbiddenException('Unauthorized session delete');
    }

    await this.sessionService.deleteById(id);
  }

  @Delete()
  @HttpCode(204)
  async deleteAll(@Req() req) {
    await this.sessionService.deleteAllByUser(req.user.userId);
  }
}
