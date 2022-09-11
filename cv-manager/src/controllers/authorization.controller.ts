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
import { LoginDto } from '../domain/dto';
import { ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger';


@Controller('authorization')
@ApiTags('Authorization')
export class AuthorizationController {
  constructor() {}

  
  @UseGuards(LoginGuard)
  @Post('/login')
  @ApiBody({type: LoginDto})
  @ApiOperation({summary:'sign in', description:'Sign in to the user, with email and password, and receive a cookie for authentication'})
  @ApiCreatedResponse({description:'Signed in successfully'})
  @ApiForbiddenResponse({description:'Unauthorized'})
  login(@Req() req: Request & { user: User }): any {
    return {
      User: req.user,
      status: 'Success',
    };
  }



  @UseGuards(AuthenticatedGuard)
  @Get('/logout')
  @ApiOperation({summary:'sign out', description:'Sign out from the user and delete the cookie session from the server.'})
  @ApiCreatedResponse({description:'Signed out successfully'})
  @ApiForbiddenResponse({description:'Unauthorized'})
  logout(@Req() req): any {
    req.session.destroy();
    return { status: 'Success' };
  }
}
