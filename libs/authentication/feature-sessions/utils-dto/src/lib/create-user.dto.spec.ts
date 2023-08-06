// Libraries
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
// Tested elements
import { CreateUserDto } from './create-user.dto';

// ----------------------------------------------------------------------------
const stubCreateUserDto = (): {
  name: any;
  mail: any;
  role: any;
} => ({
  name: 'User',
  mail: 'user@gmail.com',
  role: 'user',
});

// ----------------------------------------------------------------------------
describe('create-user.dto', () => {
  let importedDto: CreateUserDto;
  let errors: any;

  const runAndValidate = async (input: { name: any; mail: any; role: any }) => {
    importedDto = plainToInstance(CreateUserDto, input);
    errors = await validate(importedDto);
  };

  beforeEach(() => jest.clearAllMocks());

  describe('name', () => {
    describe('When the name is not a string', () => {
      beforeEach(async () => await runAndValidate({ ...stubCreateUserDto(), name: 657684 }));

      it('Should throw an error', () => expect(errors.length).toBe(1));
      it('Should have a name error', () => expect(errors[0].property).toBe('name'));
    });
    describe('When the name is shorter than 3 characters', () => {
      beforeEach(async () => await runAndValidate({ ...stubCreateUserDto(), name: 's' }));

      it('Should throw an error', () => expect(errors.length).toBe(1));
      it('Should have a name error', () => expect(errors[0].property).toBe('name'));
    });
  });

  describe('mail', () => {
    describe('When the mail is not a string', () => {
      beforeAll(async () => await runAndValidate({ ...stubCreateUserDto(), mail: 45962345623498 }));

      it('Should throw an error', () => expect(errors.length).toBe(1));
      it('Should have a mail error', () => expect(errors[0].property).toBe('mail'));
    });
    describe('When the mail is not a valid address', () => {
      beforeAll(
        async () => await runAndValidate({ ...stubCreateUserDto(), mail: 'definetelynotanaddress' })
      );

      it('Should throw an error', () => expect(errors.length).toBe(1));
      it('Should have a mail error', () => expect(errors[0].property).toBe('mail'));
    });
  });

  describe('role', () => {
    describe('When the role is not a either user or admin', () => {
      beforeAll(async () => await runAndValidate({ ...stubCreateUserDto(), role: 45962345623498 }));

      it('Should default to user', () => expect(importedDto.role).toBe('user'));
    });
    describe('When the role is admin', () => {
      beforeAll(async () => await runAndValidate({ ...stubCreateUserDto(), role: 'admin' }));

      it('Should remain as admin', () => expect(importedDto.role).toBe('admin'));
    });
  });
});
