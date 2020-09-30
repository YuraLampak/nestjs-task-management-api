import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from "./user.entity";
import { UnauthorizedException } from "@nestjs/common";

const mockUserFactory = () => ({
  findOne: jest.fn(),
})

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserFactory },
      ]
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepo = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'Test';

      userRepo.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: 'Test' });
      expect(userRepo.findOne).toHaveBeenCalledWith({ username: 'Test' });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', () => {
      userRepo.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({ username: 'Test' })).rejects.toThrow(UnauthorizedException);
    });
  });
})