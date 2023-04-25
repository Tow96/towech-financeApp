import { UserModel } from '@towech-finance/shared/utils/models';
import { passwordStub, userStub } from './user.stub';
import { Provider } from '@nestjs/common';
import { AuthenticationUserService } from '../lib/authentication-user.service';

const plainUserStub = (): UserModel => {
  return {
    _id: userStub()._id.toString(),
    accountConfirmed: userStub().accountConfirmed,
    mail: userStub().mail,
    name: userStub().name,
    role: userStub().role,
  };
};

const mockValues = {
  getByEmail: jest.fn((mail: string) => {
    if (mail === plainUserStub().mail) return userStub();
    return null;
  }),

  validatePassword: jest.fn((id: string, password: string) => {
    return id === plainUserStub()._id && password === passwordStub();
  }),
};

export const AuthUserRepoMock: Provider = {
  provide: AuthenticationUserService,
  useValue: mockValues,
};
