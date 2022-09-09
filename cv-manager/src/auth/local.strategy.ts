import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy } from 'passport-local';
import { AuthorizationDomain } from '../domain/authorization.domain';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly domainService: AuthorizationDomain) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<User> {
    const obj = await this.domainService.login({ email, password });
    if (obj instanceof Error) {
      throw new UnauthorizedException(obj.message);
    }
    return obj;
  }
}
