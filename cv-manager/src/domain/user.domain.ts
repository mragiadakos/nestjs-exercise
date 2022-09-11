import { Injectable } from '@nestjs/common';
import {  SignUpDto } from './dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from '../repos/user.repository';
import { User } from '@prisma/client';
import { CVDomain } from './cv.domain';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserDomain {
  constructor(private userRepo: UserRepository,private cvDomain: CVDomain) {}

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
    const hash = await bcrypt.hash(input.password, 10);
    const newUser = this.userRepo.createUser({
      email: input.email,
      password: hash,
      name: input.name,
    });
    if (!newUser) {
      return new Error('user ' + signUpDto.email + ' could not be created');
    }

    return null;
  }

  async deleteSelf(user: User): Promise<Error> {
    const userObj = await this.userRepo.user({ id: user.id });
    if (!userObj) {
      return new Error('user ' + user.email + ' does not exists');
    }
    const err = await this.cvDomain.deleteCV(user)
    if(err instanceof Error){
      return err
    }
    await this.userRepo.deleteUser({id:user.id})
  }
  

  
}
