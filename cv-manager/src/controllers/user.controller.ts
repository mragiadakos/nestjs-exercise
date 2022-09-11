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
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userDomain: UserDomain) {}
  @Post('/signup')
  @ApiOperation({summary:'Create user', description:'Create a new user by adding name, email and password'})
  @ApiOkResponse({description:'Created successfully.'})
  @ApiBadRequestResponse({description:'User\'s info didn\'t pass validations.'})
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
  @ApiOperation({summary:'User\'s info', description:'Get the current user\'s account information.'})
  @ApiOkResponse({description:'User\'s info'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  getMe(@Req() req: Request & { user: User }, @Res() res: Response) {
    res.status(HttpStatus.OK).json(req.user);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/me')
  @ApiOperation({summary:'Delete user', description:'Delete current user\'s account.'})
  @ApiOkResponse({description:'Delete successfully'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
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
