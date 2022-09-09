import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizationController } from './authorization/authorization.controller';
import { UserRepository } from './repos/user.repository';
import { PrismaService } from './prisma/prisma.service';
import { DomainService } from './domain/domain.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, AuthorizationController],
  providers: [AppService, UserRepository, PrismaService, DomainService],
})
export class AppModule {}
