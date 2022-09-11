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
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import FileUploadDto from './fileUpload.dto';

@Controller('cv')
@ApiTags('CV')
export class CVController {
  constructor(private readonly cvDomain: CVDomain) { }

  @UseGuards(AuthenticatedGuard)
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({summary:'Upload CV file', description:'Upload new CV file to the file storage and save the information in the DB.'})
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A new CV document for the user',
    type: FileUploadDto,
  })
  @ApiOkResponse({description:'Uploaded successfully'})
  @ApiBadRequestResponse({description:'CV file failed to pass validations'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
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
  @ApiOperation({summary: 'CV info',description:'Get information about the CV from DB'})
  @ApiOkResponse({description:'CV info'})
  @ApiNotFoundResponse({description: 'CV file not found'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
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
  @ApiOperation({summary:'Download CV file', description:'Download CV file from file storage'})
  @ApiOkResponse({description:'Downloaded successfully'})
  @ApiNotFoundResponse({description: 'CV file not found'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
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
  @ApiOperation({summary:'Delete CV file',description:'Delete CV file from DB and file storage if it exists.'})
  @ApiOkResponse({description:'Deleted successfully'})
  @ApiNotFoundResponse({description: 'CV file not found'})
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
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
