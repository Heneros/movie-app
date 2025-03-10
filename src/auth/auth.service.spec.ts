import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserService } from './services/createUser.service';
import { resetDatabase } from '@/@/prisma/prisma.test';
import { MailService } from '@/mail/mail.service';
import { BadRequestException } from '@nestjs/common';
import { tempRegisterDate } from '@/data/defaultData';

describe('AuthService create use (integration)', () => {
  let createUserService: CreateUserService;
  let prismaService: PrismaService;
  let mailService: MailService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    verifyResetToken: {
      create: jest.fn(),
    },
  };

  const mailMock = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: MailService, useValue: mailMock },
      ],
    }).compile();

    createUserService = module.get<CreateUserService>(CreateUserService);
    prismaService = module.get<PrismaService>(PrismaService);
    mailService = module.get<MailService>(MailService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should compile the module', async () => {
    expect(module).toBeDefined();
  });

  it('Should throw an erorr if user already existing', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'testtest@example.com',
    });

    const mockResponse = {} as Response;

    await expect(
      createUserService.create(mockResponse, {
        email: 'testtest@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        name: 'Test User',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('Should throw an error if passwords dont match', async () => {
    const mockResponse = {} as Response;

    await expect(
      createUserService.create(mockResponse, {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'wrongpassword',
        name: 'Test User',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create a user and send an email', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    });
    prismaMock.verifyResetToken.create.mockResolvedValue({
      token: 'randomToken',
      expiresAt: tempRegisterDate,
    });
    mailMock.sendEmail.mockResolvedValue(true);

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const result = await createUserService.create(mockResponse, {
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
      name: 'Test User',
    });

    expect(prismaMock.user.create).toHaveBeenCalled();
    expect(prismaMock.verifyResetToken.create).toHaveBeenCalled();
    expect(mailMock.sendEmail).toHaveBeenCalled();

    expect(result).toEqual({
      email: 'test@example.com',
      emailVerificationToken: expect.objectContaining({
        token: expect.any(String),
      }),
    });
  });

  beforeEach(async () => {
    await resetDatabase();
  });
});
