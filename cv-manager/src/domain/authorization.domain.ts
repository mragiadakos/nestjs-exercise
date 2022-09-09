import { Injectable, Logger } from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '../repos/user.repository';
import { User } from '@prisma/client';
import { CVDomain } from './cv.domain';

@Injectable()
export class AuthorizationDomain {
  constructor(private userRepo: UserRepository) {}

  async signUp(signUpDto: SignUpDto): Promise<Error> {
    const input: SignUpDto = plainToInstance(SignUpDto, signUpDto);
    const valErrs = await validate(input);
    if (valErrs.length > 0) {
      let message = '';
      for (const err of valErrs) {
        message += err.toString();
      }
      return new Error(message);
    }

    const userObj = await this.userRepo.user({ email: input.email });
    if (userObj) {
      return new Error('user ' + signUpDto.email + ' exists');
    }

    const newUser = this.userRepo.createUser({
      email: input.email,
      password: input.password,
      name: input.name,
    });
    if (!newUser) {
      return new Error('user ' + signUpDto.email + ' could not be created');
    }

    return null;
  }

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

    if (userObj.password !== input.password) {
      return new Error('password not correct');
    }

    userObj.password = '';

    return userObj;
  }

  
}
