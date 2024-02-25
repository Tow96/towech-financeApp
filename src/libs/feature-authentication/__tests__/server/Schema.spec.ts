// Libraries ------------------------------------------------------------------
// Tested components ----------------------------------------------------------
import { ZodError } from 'zod';
import { InsertUser, insertUserSchema } from '../../Schema';
// Mocks ----------------------------------------------------------------------

describe('insertUserSchema', () => {
  describe('Given an invalid email', () => {
    const testData: InsertUser = { email: 'invalid', name: 'name', role: 'owner' };
    test('- Then it should throw an error when parsed', () => {
      const t = () => insertUserSchema.parse(testData);
      expect(t).toThrow(
        new ZodError([
          {
            validation: 'email',
            code: 'invalid_string',
            message: 'Invalid email',
            path: ['email'],
          },
        ])
      );
    });
  });
  describe('Given a name shorter than 3 characters', () => {
    const testData: InsertUser = { email: 'old@mail.com', name: 'na', role: 'owner' };
    test('- Then it should throw an error when parsed', () => {
      const t = () => insertUserSchema.parse(testData);
      expect(t).toThrow(
        new ZodError([
          {
            code: 'too_small',
            minimum: 3,
            type: 'string',
            inclusive: true,
            exact: false,
            message: 'String must contain at least 3 character(s)',
            path: ['name'],
          },
        ])
      );
    });
  });
  describe('Given valid but unformatted data', () => {
    const testData = { email: ' old@mail.com ', name: '  name   ', role: 'user' };
    test('- Then it should format the data properly', () => {
      const result = insertUserSchema.parse(testData);
      expect(result).toEqual({ email: 'old@mail.com', name: 'name', role: 'user' });
    });
  });
});
