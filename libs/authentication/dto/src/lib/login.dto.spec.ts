// Libraries
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
// Tested elements
import { LoginDto } from './login.dto';

const stubLoginUser = (): {
  keepSession: any;
  password: any;
  username: any;
} => ({
  keepSession: false,
  password: 'pass',
  username: 'user',
});

let testData: { keepSession: any; password: any; username: any };
let importedDto: LoginDto;
let errors: any;

const resetTest = () => {
  jest.clearAllMocks();
  testData = stubLoginUser();
};

const runAndValidate = async (input: { username: any; password: any; keepSession: any }) => {
  importedDto = plainToInstance(LoginDto, input);
  errors = await validate(importedDto);
};

describe('username', () => {
  beforeAll(() => resetTest());

  describe('When the username is not a string', () => {
    beforeAll(async () => {
      testData.username = 657684;
      importedDto = plainToInstance(LoginDto, testData);
      errors = await validate(importedDto);
    });

    it('Should throw an error', () => {
      expect(errors.length).toBe(1);
    });

    it('Should have a name error', () => {
      expect(errors[0].property).toBe('username');
    });
  });
});

describe('password', () => {
  beforeAll(() => resetTest());

  describe('When the password is not a string', () => {
    beforeAll(async () => {
      testData.password = 657684;
      importedDto = plainToInstance(LoginDto, testData);
      errors = await validate(importedDto);
    });

    it('Should throw an error', () => {
      expect(errors.length).toBe(1);
    });

    it('Should have a name error', () => {
      expect(errors[0].property).toBe('password');
    });
  });
});

describe('keepSession', () => {
  describe('When it is not a boolean', () => {
    beforeEach(async () => {
      resetTest();
      testData.keepSession = 38942;
      runAndValidate(testData);
    });

    it('Should throw an error', () => {
      expect(errors.length).toBe(1);
    });

    it('Should have a keepSession error', () => {
      expect(errors[0].property).toBe('keepSession');
    });
  });
});
