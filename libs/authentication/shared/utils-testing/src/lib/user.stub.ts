import { Types } from 'mongoose';
import { UserRoles } from '@finance/shared/utils-types';

export const authTokenSecret = 'testAuthToken';
export const refreshTokenSecret = 'testRefreshToken';

export const passwordStub = (): string => 'testpass';
export const refreshArrStub = (): string =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRoaXMtaXMtYS1sb25nLXN0cmluZyIsInVzZXIiOnsiX2lkIjoiNjNlZjllYmNhMmI0OGYxZmU3NGIwMTBhIiwiYWNjb3VudENvbmZpcm1lZCI6dHJ1ZSwibWFpbCI6ImZha2VAbWFpbC5jb20iLCJuYW1lIjoiRmFrZW1hbiIsInJvbGUiOiJ1c2VyIn19.IldnFSHLgO-J3BrhBQsEO0-MO0a2E_Q68VvUl0U2SAw';
export const singleTokenStub = (): string =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2VmOWViY2EyYjQ4ZjFmZTc0YjAxMGEiLCJhY2NvdW50Q29uZmlybWVkIjp0cnVlLCJtYWlsIjoiZmFrZUBtYWlsLmNvbSIsIm5hbWUiOiJGYWtlbWFuIiwicm9sZSI6InVzZXIifQ.abMoykKiZ288G_XmetmRiWqbPjgI9JDQm90qalFNICc';
export const refreshArrAdminStub = (): string =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRoaXMtaXMtYS1sb25nLXN0cmluZyIsInVzZXIiOnsiX2lkIjoiNjNlZjllYmNhMmI0OGYxZmU3NGIwMTBiIiwiYWNjb3VudENvbmZpcm1lZCI6dHJ1ZSwibWFpbCI6ImZha2VAbWFpbC5jb20iLCJuYW1lIjoiRmFrZW1hbiIsInJvbGUiOiJhZG1pbiJ9fQ.lCXznhYPG6coGXgS4qsDq14ff1th0zEdBjOfMxeHcY0';
export const singleTokenAdminStub = (): string =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2VmOWViY2EyYjQ4ZjFmZTc0YjAxMGIiLCJhY2NvdW50Q29uZmlybWVkIjp0cnVlLCJtYWlsIjoiZmFrZUBtYWlsLmNvbSIsIm5hbWUiOiJGYWtlbWFuIiwicm9sZSI6ImFkbWluIn0._vNWft7MArkBGZ5xqHpoTaj2uyV93YFn1C4l-56fkJE';

export const userStub = () => ({
  _id: new Types.ObjectId('63ef9ebca2b48f1fe74b010a'),
  accountConfirmed: true,
  createdAt: new Date(0, 0, 0),
  mail: 'fake@mail.com',
  name: 'Fakeman',
  password: '$2a$12$JxPo81IP7gIwdReGNCYNEOFi5usufyYbnWKHuZpiBkRdOZEx6XUoW',
  refreshTokens: ['$2b$10$0ImDI.kG2FNVslHTVUwPuuWsaDDzC.GCUsp5Q5TC9kQl783mQhG5G'],
  singleSessionToken: '$2b$10$/GdFsl.4q8ylU22Cvex1z.sRddjEfJBkwx/8.vnVCaDBL.6PiRwvy',
  role: UserRoles.USER,
});
export const adminStub = () => ({
  _id: new Types.ObjectId('63ef9ebca2b48f1fe74b010b'),
  accountConfirmed: true,
  createdAt: new Date(0, 0, 0),
  mail: 'fake@mail.com',
  name: 'Fakeman',
  password: '$2a$12$JxPo81IP7gIwdReGNCYNEOFi5usufyYbnWKHuZpiBkRdOZEx6XUoW',
  refreshTokens: ['$2b$10$4nUCRccfSBMV0wxuege6zezsBKyu1ZKDYow/z6YWJBCa0tNFKwBiK'],
  singleSessionToken: '$2b$10$8jEe41kmbL/oRNFIysVXK..utYP9SA9UojUkUgzkAILAD1pvjx7j6',
  role: UserRoles.ADMIN,
});
export const plainUserStub = () => {
  return {
    _id: userStub()._id.toString(),
    accountConfirmed: userStub().accountConfirmed,
    mail: userStub().mail,
    name: userStub().name,
    role: userStub().role,
  };
};
export const plainAdminStub = () => {
  return {
    _id: adminStub()._id.toString(),
    accountConfirmed: adminStub().accountConfirmed,
    mail: adminStub().mail,
    name: adminStub().name,
    role: adminStub().role,
  };
};
