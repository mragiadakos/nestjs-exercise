import {
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import {  Request } from 'express';
import { LoginGuard } from '../auth/login.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { User } from '@prisma/client';
import { LoginDto } from 'src/domain/dto';

@Controller('authorization')
export class AuthorizationController {
  constructor() {}

  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Req() req: Request & { user: User }, @Body() loginDto: LoginDto): any {
    return {
      User: req.user,
      status: 'Success',
    };
  }



  @UseGuards(AuthenticatedGuard)
  @Get('/logout')
  logout(@Req() req): any {
    req.session.destroy();
    return { status: 'Success' };
  }
}
