import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Req,
  UseGuards,
  Get,
  Delete,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { SignUpDto } from '../domain/dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { User } from '@prisma/client';
import { UserDomain } from '../domain/user.domain';

@Controller('user')
export class UserController {
  constructor(private readonly userDomain: UserDomain) {}
  @Post('/signup')
  async signUp(@Res() res: Response, @Body() signUpDto: SignUpDto) {
    const err = await this.userDomain.signUp(signUpDto);
    if (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Bad Request',
        message: err.message,
      });
      return;
    }
    res.status(HttpStatus.OK).json({ status: 'Success' });
  }


  @UseGuards(AuthenticatedGuard)
  @Get('/me')
  getMe(@Req() req: Request & { user: User }, @Res() res: Response) {
    res.status(HttpStatus.OK).json(req.user);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/me')
  async deleteMe(@Req() req: Request & { user: User }, @Res() res: Response) {
    const err = await this.userDomain.deleteSelf(req.user)
    if (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Bad Request',
        message: err.message,
      });
      return;
    }
    req.session.destroy((err)=>{
      res.status(HttpStatus.OK).json({ status: 'Success' });

    });

  }

}
