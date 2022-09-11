import {
  Controller,
  HttpStatus,
  Post,
  Res,
  Req,
  UseGuards,
  ParseFilePipe,
  UploadedFile,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
  Get,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Express } from 'express'
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { User } from '@prisma/client';
import { CVDomain } from '../domain/cv.domain';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cv')
export class CVController {
  constructor(private readonly cvDomain: CVDomain) { }

  @UseGuards(AuthenticatedGuard)
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async addCV(@Req() req: Request & { user: User },
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File) {
    const cvObj = await this.cvDomain.addCV(req.user, file);
    if (cvObj instanceof Error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'Bad Request',
        message: cvObj.message,
      });
      return;
    }


    res.status(HttpStatus.OK).json({ status: 'Success' });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/')
  async getCV(@Req() req: Request & { user: User },
    @Res() res: Response) {
    const cvObj = await this.cvDomain.getCV(req.user)
    if (cvObj instanceof Error) {
      res.status(HttpStatus.NOT_FOUND).json({
        status: 'Not Found',
        message: cvObj.message,
      });
      return;
    }
    res.status(HttpStatus.OK).json(cvObj);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/download')
  async downloadCV(@Req() req: Request & { user: User },
    @Res() res: Response) {
    const cvObj = await this.cvDomain.downloadCV(req.user)
    if (cvObj instanceof Error) {
      res.status(HttpStatus.NOT_FOUND).json({
        status: 'Not Found',
        message: cvObj.message,
      });
      return;
    }
    cvObj.readStream.on('data', chunk => {
      res.write(chunk, 'binary');
    });
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + cvObj.filename,
    });
    cvObj.readStream.on('end', () => {
      res.status(HttpStatus.OK).end();
    });
    cvObj.readStream.on('error', err => {
      throw new BadRequestException(err.stack);
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/')
  async deleteCV(@Req() req: Request & { user: User },
    @Res() res: Response) {
    const err = await this.cvDomain.deleteCV(req.user)
    if (err instanceof Error) {
      res.status(HttpStatus.NOT_FOUND).json({
        status: 'Not Found',
        message: err.message,
      });
      return;
    }
    res.status(HttpStatus.OK).json({status:'Success'});
  }

}
