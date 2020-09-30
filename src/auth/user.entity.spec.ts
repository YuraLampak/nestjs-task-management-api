import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User entity', () => {
  let user: User;
  
  beforeEach(() => {
    user = new User();
    user.password = 'testPassword'
    user.salt = 'testSalt';
    bcrypt.hash = jest.fn();
  })

  it('returns true as password is valid', async () => {
    bcrypt.hash.mockReturnValue('testPassword');
    expect(bcrypt.hash).not.toHaveBeenCalled();
    const result = await user.validatePassword('1234');
    expect(bcrypt.hash).toHaveBeenCalledWith('1234', 'testSalt');
    expect(result).toEqual(true);
  });

  it('returns false as password is invalid', async () => {
    bcrypt.hash.mockReturnValue('wrongPass');
    expect(bcrypt.hash).not.toHaveBeenCalled();
    const result = await user.validatePassword('wrongPass');
    expect(bcrypt.hash).toHaveBeenCalledWith('wrongPass', 'testSalt');
    expect(result).toEqual(false);
  });
});