import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthorizationDomain } from '../domain/authorization.domain';
import { UserRepository } from '../repos/user.repository';
import { PrismaService } from '../prisma/prisma.service';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [PassportModule.register({ session: true })],
  providers: [
    AuthorizationDomain,
    UserRepository,
    PrismaService,
    LocalStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
