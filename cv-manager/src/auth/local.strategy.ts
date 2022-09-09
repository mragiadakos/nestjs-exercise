import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy } from 'passport-local';
import { DomainService } from '../domain/domain.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly domainService: DomainService) {
    super({
      usernameField: 'email'
    });
  }
  async validate(email: string, password: string): Promise<User> {
    const obj = await this.domainService.login({email,password});
    if (obj instanceof Error) {
      throw new UnauthorizedException(obj.message)
    }
    return obj;
  }
}