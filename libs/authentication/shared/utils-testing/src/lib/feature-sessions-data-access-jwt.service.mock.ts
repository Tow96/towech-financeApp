// Libraries
import { Provider } from '@nestjs/common';
import { jest } from '@jest/globals';
// Service
import { AuthenticationSessionsJwtService } from '@finance/authentication/feature-sessions/data-access-jwt';
// stubs
import { singleTokenStub, userStub } from './user.stub';

const mockValues = {
  generateAuthToken: jest.fn(() => singleTokenStub()),
  generateRefreshToken: jest.fn(() => ({
    token: singleTokenStub(),
    id: userStub()._id.toString(),
  })),
};

export const AuthenticationSessionsJwtServiceMock: Provider = {
  provide: AuthenticationSessionsJwtService,
  useValue: mockValues,
};
