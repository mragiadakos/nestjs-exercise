import { Injectable, Logger } from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '../repos/user.repository';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthorizationDomain {
  constructor(private userRepo: UserRepository) {}

  async login(loginDto: LoginDto): Promise<Error | User> {
    const input: LoginDto = plainToInstance(LoginDto, loginDto);
    const valErrs = await validate(input);
    if (valErrs.length > 0) {
      let message = '';
      for (const err of valErrs) {
        message += err.toString();
      }
      return new Error(message);
    }

    const userObj = await this.userRepo.user({ email: input.email });
    if (!userObj) {
      return new Error('user ' + input.email + ' does not exists');
    }

    const isCor = await bcrypt.compare(input.password,userObj.password)
    if (!isCor) {
      return new Error('password not correct');
    }

    userObj.password = '';

    return userObj;
  }
  

  
}
