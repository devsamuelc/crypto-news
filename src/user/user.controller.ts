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
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/auth/roles/roles.decorator';
import { JwtStrategy } from '@/auth/jwt/jwt.strategy';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @UseGuards(JwtStrategy)
  @ApiBearerAuth()
  @Get('me')
  getProfile(@Req() req) {
    console.log(req.user);

    return req.user;
  }

  @Get()
  @UseGuards(JwtStrategy)
  @ApiBearerAuth()
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.userService.findAll(page, limit);
  }

  // @Get('email/:email')
  // async findByEmail(@Param('email') email: string) {
  //   return this.userService.findByEmail(email);
  // }

  @Get(':id')
  @UseGuards(JwtStrategy)
  @ApiBearerAuth()
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtStrategy)
  @ApiBearerAuth()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, dto);
  }
  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtStrategy)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.softDelete(id);
  }

  @Put(':id/role')
  @UseGuards(JwtStrategy)
  @ApiBearerAuth()
  @Roles('ADMIN')
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('role') role: Role,
  ) {
    return this.userService.setRole(id, role);
  }
}
