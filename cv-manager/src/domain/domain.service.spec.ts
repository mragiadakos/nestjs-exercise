import { Test, TestingModule } from '@nestjs/testing';
import { Resolver } from 'dns';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../repos/user.repository';
import { DomainService } from './domain.service';
import { LoginDto, SignUpDto } from './dto';

describe('DomainService', () => {
  let service: DomainService;
  let userRepo: UserRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomainService, UserRepository, PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService)
    userRepo = module.get<UserRepository>(UserRepository)
    service = module.get<DomainService>(DomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  it('validate failed inputs in signup', async () => {
    const errInputs: SignUpDto[] = [{
      email: "no-email",
      password: "password",
      name: "name"
    },
    {
      email: "",
      password: "password",
      name: "name"
    },
    {
      email: "myemail@gmail.com",
      password: "",
      name: "name"
    },
    {
      email: "myemail@gmail.com",
      password: "password",
      name: ""
    },
    ]

    for (const input of errInputs) {
      const res = await service.signUp(input)
      expect(res).toBeInstanceOf(Error)
    }

  });

  it('user exists failed signup', async () => {
    const input: SignUpDto = {
      email: "myemail@gmail.com",
      password: "password",
      name: "name"
    }

    jest.spyOn(userRepo, 'user').mockImplementation(() => Promise.resolve({
      id: 1,
      email: "myemail@gmail.com",
      password: "password",
      name: "name"
    }));

    const res = await service.signUp(input)
    expect(res).toBeInstanceOf(Error)

  });

  it('successful signup', async () => {
    const input: SignUpDto = {
      email: "myemail@gmail.com",
      password: "password",
      name: "name"
    }

    jest.spyOn(userRepo, 'user').mockImplementation(() => null);
    jest.spyOn(userRepo, 'createUser').mockImplementation(() => Promise.resolve({
      id: 1,
      email: "myemail@gmail.com",
      password: "password",
      name: "name"
    }));
    const res = await service.signUp(input)
    expect(res).toEqual(null)
  });

  it('validate failed inputs for login', async () => {
    const errInputs: LoginDto[] = [{
      email: "no-email",
      password: "password",
    },
    {
      email: "",
      password: "password",
    },
    {
      email: "myemail@gmail.com",
      password: "",
    },
    ]

    for (const input of errInputs) {
      const res = await service.login(input)
      expect(res).toBeInstanceOf(Error)
    }
  });

  it('user does not exist failed login', async () => {
    const input = {
      email: "myemail@gmail.com",
      password: "password",
    }

    jest.spyOn(userRepo, 'user').mockImplementation(() => null);
    const res = await service.login(input)
    expect(res).toBeInstanceOf(Error)
  })

  it('password is wrong failed login', async () => {
    const input = {
      email: "myemail@gmail.com",
      password: "wrong-password",
    }

    jest.spyOn(userRepo, 'user').mockImplementation(() => Promise.resolve({
      id: 1,
      email: "myemail@gmail.com",
      password: "password",
      name: "name"
    }));
    const res = await service.login(input)
    expect(res).toBeInstanceOf(Error)
  })

  it('successful login', async () => {
    const input = {
      email: "myemail@gmail.com",
      password: "password",
    }
    const user = {
      id: 1,
      email: "myemail@gmail.com",
      password: "password",
      name: "name"
    }
    jest.spyOn(userRepo, 'user').mockImplementation(() => Promise.resolve(user));
    
    const res = await service.login(input)
    user.password = ""
    expect(res).toEqual(user)
  })


});
