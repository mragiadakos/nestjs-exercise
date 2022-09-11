import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import internal from 'stream';

export class LoginDto {
  @ApiProperty({
    description: 'The user name for login'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password for login in clear text'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpDto {
  @ApiProperty({
    description: 'The email of the user'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user'
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'The full name of the user'
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}


export type DownloadCV = {
  filename: string;
  readStream: internal.Readable
}


