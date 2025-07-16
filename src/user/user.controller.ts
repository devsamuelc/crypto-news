import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt/jwt.auth.guard';
import { Authentication } from '@/auth/decorators/auth.decorator';
import { IAuthentication } from '@/auth/entities/authentication';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  getProfile(@Authentication() authentication: IAuthentication) {
    const { userId } = authentication;

    return this.userService.findById(userId);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: true, default: 1 })
  @ApiQuery({ name: 'limit', required: true, default: 10 })
  @ApiBearerAuth()
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.userService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async softDelete(
    @Authentication() authentication: IAuthentication,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const { role } = authentication;

    if (role !== Role.ADMIN)
      throw new ForbiddenException('Access denied: insufficient role');

    await this.userService.softDelete(id);
  }

  @Put(':id/role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateRole(
    @Authentication() authentication: IAuthentication,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('role') role: Role,
  ) {
    const { role: userRole } = authentication;

    if (userRole !== Role.ADMIN)
      throw new ForbiddenException('Access denied: insufficient role');

    return this.userService.setRole(id, role);
  }
}
