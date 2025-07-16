import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt/jwt.auth.guard';

@ApiTags('Cryptos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cryptos')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get()
  async findAll() {
    return this.cryptoService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name') name: string) {
    const crypto = await this.cryptoService.findByName(name);

    if (!crypto) throw new NotFoundException(`Crypto ${name} not found`);

    return crypto;
  }

  @Get(':name/updates')
  async findUpdates(@Param('name') name: string) {
    const updates = await this.cryptoService.findUpdates(name);

    if (!updates) throw new NotFoundException(`No updates for ${name}`);

    return updates;
  }
}
