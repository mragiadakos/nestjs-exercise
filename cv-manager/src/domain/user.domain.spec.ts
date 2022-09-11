import { Test, TestingModule } from '@nestjs/testing';
import { MinioModule, MinioService } from 'nestjs-minio-client';
import { CVRepository } from '../repos/cv.repository';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../repos/user.repository';
import { CVDomain } from './cv.domain';
import { SignUpDto } from './dto';
import { UserDomain } from './user.domain';

describe('UserDomain', () => {
  let service: UserDomain;
  let userRepo: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MinioModule.register({
        endPoint: '127.0.0.1',
        port: 9000,
        useSSL: false,
        accessKey: 'ROOTUSER',
        secretKey: 'CHANGEME123'
      })],
      providers: [UserDomain, UserRepository, PrismaService, CVDomain, CVRepository],
    }).compile();

    userRepo = module.get<UserRepository>(UserRepository);
    service = module.get<UserDomain>(UserDomain);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validate failed inputs in signup', async () => {
    const errInputs: SignUpDto[] = [
      {
        email: 'no-email',
        password: 'password',
        name: 'name',
      },
      {
        email: '',
        password: 'password',
        name: 'name',
      },
      {
        email: 'myemail@gmail.com',
        password: '',
        name: 'name',
      },
      {
        email: 'myemail@gmail.com',
        password: 'password',
        name: '',
      },
    ];

    for (const input of errInputs) {
      const res = await service.signUp(input);
      expect(res).toBeInstanceOf(Error);
    }
  });

  it('user exists failed signup', async () => {
    const input: SignUpDto = {
      email: 'myemail@gmail.com',
      password: 'password',
      name: 'name',
    };

    jest.spyOn(userRepo, 'user').mockImplementation(() =>
      Promise.resolve({
        id: 1,
        email: 'myemail@gmail.com',
        password: 'password',
        name: 'name',
      }),
    );

    const res = await service.signUp(input);
    expect(res).toBeInstanceOf(Error);
  });

  it('successful signup', async () => {
    const input: SignUpDto = {
      email: 'myemail@gmail.com',
      password: 'password',
      name: 'name',
    };

    jest.spyOn(userRepo, 'user').mockImplementation(() => null);
    jest.spyOn(userRepo, 'createUser').mockImplementation(() =>
      Promise.resolve({
        id: 1,
        email: 'myemail@gmail.com',
        password: 'password',
        name: 'name',
      }),
    );
    const res = await service.signUp(input);
    expect(res).toEqual(null);
  });


});
