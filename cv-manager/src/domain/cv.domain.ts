import { Injectable, Logger } from '@nestjs/common';
import { CV, User } from '@prisma/client';
import { MinioService } from 'nestjs-minio-client';
import { InjectQueue } from '@nestjs/bull';
import { CV_BUCKET } from '../constants';
import { CVRepository } from '../repos/cv.repository';
import { DownloadCV } from './dto';
import { Queue } from 'bull';

const allowedMimetypes: string[] = [
  'application/vnd.oasis.opendocument.text',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

@Injectable()
export class CVDomain {
  constructor(private readonly cvRepo: CVRepository,
    private readonly minioServ: MinioService,
    @InjectQueue('process-cv') private processCVQueue: Queue) { }

  cvFilenameBasedOnUser(user: User): string {
    return `cv-user-${user.id}`
  }
  async addCV(user: User, file: Express.Multer.File): Promise<Error | CV> {
    if (!user) {
      return new Error('no user is selected')
    }
    if (!file) {
      return new Error('the CV is not correct')
    }

    const exists = allowedMimetypes.includes(file.mimetype)
    if (!exists) {
      return new Error('this is not a filetype of a document')
    }

    if (file.size > 1000000) {
      return new Error('no file over 1mb is accepted')
    }

    const cvFilename = this.cvFilenameBasedOnUser(user)
    const metadata = {
      'original_name': file.originalname,
      'size': file.size,
      'mimetype': file.mimetype,
      'fieldname': file.fieldname
    }
    const res = await this.minioServ.client.putObject(CV_BUCKET, cvFilename, file.buffer, metadata)

    const curCV = await this.cvRepo.cv({ authorId: user.id })
    let newCV: CV
    if (curCV) {
      newCV = await this.cvRepo.updateCV({
        where: { authorId: user.id }, data: {
          etagId: res.etag,
          name: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        }
      })
    } else {
      newCV = await this.cvRepo.createCV({
        author: { connect: { id: user.id } },
        etagId: res.etag,
        name: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      })
    }

    this.processCVQueue.add('cv', {
      bucket: CV_BUCKET,
      objectName: cvFilename,
      filename: file.originalname,
      username: user.name,
      email: user.email
    })

    return newCV;
  }

  async getCV(user: User): Promise<Error | CV> {
    const cvObj = await this.cvRepo.cv({ authorId: user.id })
    if (!cvObj) {
      return new Error('no CV file exists')
    }
    return cvObj
  }

  async downloadCV(user: User): Promise<Error | DownloadCV> {
    const curCV = await this.cvRepo.cv({ authorId: user.id })
    if (!curCV) {
      return new Error('no CV file exists')
    }
    const cvFilename = this.cvFilenameBasedOnUser(user)
    const stream = await this.minioServ.client.getObject(CV_BUCKET, cvFilename)
    return {
      readStream: stream,
      filename: curCV.name,
    }
  }

  async deleteCV(user: User): Promise<Error> {
    const curCV = await this.cvRepo.cv({ authorId: user.id })
    if (!curCV) {
      return new Error('no CV file exists')
    }
    const cvFilename = this.cvFilenameBasedOnUser(user)
    await this.minioServ.client.removeObject(CV_BUCKET, cvFilename)
    await this.cvRepo.deleteCV({ id: curCV.id })
    return null
  }
}
