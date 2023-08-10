// Libraries
import { jest } from '@jest/globals';
// stubs
import { singleTokenStub, userStub } from './user.stub';

export const AuthenticationSessionsJwtServiceMock = {
  generateAuthToken: jest.fn(() => singleTokenStub()),
  generateRefreshToken: jest.fn(() => ({
    token: singleTokenStub(),
    id: userStub()._id.toString(),
  })),
};
