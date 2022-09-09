import { Body, Controller, HttpStatus, Post, Res, Req, UseGuards, Get } from '@nestjs/common';
import { Response, Request } from 'express';
import { DomainService } from '../domain/domain.service';
import { LoginDto, SignUpDto } from '../domain/dto';
import { LoginGuard } from '../auth/login.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { User } from '@prisma/client';

@Controller('authorization')
export class AuthorizationController {

    constructor(private readonly domainServ: DomainService) { }
    @Post('/signup')
    async signUp(@Res() res: Response, @Body() signUpDto: SignUpDto) {
        const err = await this.domainServ.signUp(signUpDto);
        if (err) {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: "Bad Request", message: err.message
            })
            return
        }
        res.status(HttpStatus.OK).json({ status: "Success" })
    }

    @UseGuards(LoginGuard)
    @Post('/login')
    login(@Req() req: Request & { user: User }): any {
        return {
            User: req.user,
            status: "Success"
        };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/me')
    getMe(@Req() req: Request & { user: User }, @Res() res: Response) {
        res.status(HttpStatus.OK).json(req.user)
    }


    @UseGuards(AuthenticatedGuard)
    @Get('/logout')
    logout(@Req() req): any {
        req.session.destroy();
        return { status: "Success" }
    }
}
