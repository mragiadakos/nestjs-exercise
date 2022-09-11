import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';
 
class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary',description:'The CV file for the user.' })
  file: Express.Multer.File;
}
 
export default FileUploadDto;