// Libraries
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
// Tested elements
import { CreateUserDto } from './create-user.dto';

const stubCreateUserDto = (): {
  name: any;
  mail: any;
  role: any;
} => ({
  name: 'User',
  mail: 'user@gmail.com',
  role: 'user',
});

let testData: { name: any; mail: any; role: any };
let importedDto: CreateUserDto;
let errors: any;

const resetTest = () => {
  jest.clearAllMocks();
  testData = stubCreateUserDto();
};

const runAndValidate = async (input: { name: any; mail: any; role: any }) => {
  importedDto = plainToInstance(CreateUserDto, input);
  errors = await validate(importedDto);
};

describe('name', () => {
  beforeAll(() => resetTest());

  describe('When the name is not a string', () => {
    beforeAll(async () => {
      testData.name = 657684;
      importedDto = plainToInstance(CreateUserDto, testData);
      errors = await validate(importedDto);
    });

    it('Should throw an error', () => {
      expect(errors.length).toBe(1);
    });

    it('Should have a name error', () => {
      expect(errors[0].property).toBe('name');
    });
  });

  describe('When the name is shorter than 3 characters', () => {
    beforeAll(async () => {
      testData.name = 's';
      importedDto = plainToInstance(CreateUserDto, testData);
      errors = await validate(importedDto);
    });

    it('Should throw an error', () => {
      expect(errors.length).toBe(1);
    });

    it('Should have a name error', () => {
      expect(errors[0].property).toBe('name');
    });
  });
});

describe('mail', () => {
  beforeAll(() => resetTest());

  describe('When the mail is not a string', () => {
    beforeAll(async () => {
      testData.mail = 45962345623498;
      runAndValidate(testData);
    });

    it('Should throw an error', () => {
      expect(errors.length).toBe(1);
    });

    it('Should have a mail error', () => {
      expect(errors[0].property).toBe('mail');
    });
  });

  describe('When the mail is not a valid address', () => {
    beforeAll(async () => {
      testData.mail = 'definetelynotanaddress';
      runAndValidate(testData);
    });

    it('Should throw an error', () => {
      expect(errors.length).toBe(1);
    });

    it('Should have a mail error', () => {
      expect(errors[0].property).toBe('mail');
    });
  });
});

describe('role', () => {
  beforeAll(() => resetTest());

  describe('When the role is not a either user or admin', () => {
    beforeAll(async () => {
      testData.role = 45962345623498;
      runAndValidate(testData);
    });

    it('Should default to user', () => {
      expect(importedDto.role).toBe('user');
    });
  });

  describe('When the role is admin', () => {
    beforeAll(async () => {
      testData.role = 'admin';
      runAndValidate(testData);
    });

    it('Should remain as admin', () => {
      expect(importedDto.role).toBe('admin');
    });
  });
});
