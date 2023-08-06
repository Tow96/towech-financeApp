// Libraries
import { Provider } from '@nestjs/common';
import { jest } from '@jest/globals';
// Service
import { AuthenticationFeatureSessionsDataAccessJwtService } from '@finance/authentication/feature-sessions/data-access-jwt';
// stubs
import { singleTokenStub, userStub } from './user.stub';

const mockValues = {
  generateAuthToken: jest.fn(() => singleTokenStub()),
  generateRefreshToken: jest.fn(() => ({
    token: singleTokenStub(),
    id: userStub()._id.toString(),
  })),
};

export const AuthenticationFeatureSessionsDataAccessJwtServiceMock: Provider = {
  provide: AuthenticationFeatureSessionsDataAccessJwtService,
  useValue: mockValues,
};
