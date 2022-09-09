import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import internal from 'stream';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}


export type DownloadCV = {
  filename: string;
  readStream: internal.Readable
}