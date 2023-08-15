// Libraries
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
// Tested elements
import { EditUserDto } from './edit-user.dto';

const stubEditUserDto = (): {
  name: any;
  mail: any;
} => ({
  name: 'User',
  mail: 'user@gmail.com',
});

// ----------------------------------------------------------------------------
describe('edit-user.dto', () => {
  let importedDto: EditUserDto;
  let errors: any;

  const runAndValidate = async (input: { name?: any; mail?: any }) => {
    importedDto = plainToInstance(EditUserDto, input);
    errors = await validate(importedDto);
  };

  beforeEach(() => jest.clearAllMocks());

  describe('name', () => {
    describe('When there is no name property', () => {
      beforeEach(async () => await runAndValidate({ ...stubEditUserDto(), name: undefined }));
      it('Should not throw an error', () => expect(errors.length).toBe(0));
    });
    describe('When the name is not a string', () => {
      beforeEach(async () => await runAndValidate({ ...stubEditUserDto(), name: 657684 }));

      it('Should throw an error', () => expect(errors.length).toBe(1));
      it('Should have a name error', () => expect(errors[0].property).toBe('name'));
    });
    describe('When the name is shorter than 3 characters', () => {
      beforeEach(async () => await runAndValidate({ ...stubEditUserDto(), name: 's' }));

      it('Should throw an error', () => expect(errors.length).toBe(1));
      it('Should have a name error', () => expect(errors[0].property).toBe('name'));
    });
  });

  describe('mail', () => {
    describe('When there is no mail property', () => {
      beforeEach(async () => await runAndValidate({ ...stubEditUserDto(), mail: undefined }));
      it('Should not throw an error', () => expect(errors.length).toBe(0));
    });
    describe('When the mail is not a string', () => {
      beforeAll(async () => await runAndValidate({ ...stubEditUserDto(), mail: 45962345623498 }));

      it('Should throw an error', () => expect(errors.length).toBe(1));
      it('Should have a mail error', () => expect(errors[0].property).toBe('mail'));
    });
    describe('When the mail is not a valid address', () => {
      beforeAll(
        async () => await runAndValidate({ ...stubEditUserDto(), mail: 'definetelynotanaddress' })
      );

      it('Should throw an error', () => expect(errors.length).toBe(1));
      it('Should have a mail error', () => expect(errors[0].property).toBe('mail'));
    });
  });
});
