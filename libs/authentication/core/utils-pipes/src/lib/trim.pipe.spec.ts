import { AuthenticationTrimPipe } from './trim.pipe';

const stubTrimPipe = () => {
  return {
    password: 'shouldBeEncrypted    ',
    test: ' a string that should be trimmed     ',
    innerTest: {
      otherString: ' a string ',
    },
    number: 25,
  };
};

describe('Trim Pipe', () => {
  let values: any;
  let trimPipe: AuthenticationTrimPipe;

  beforeEach(() => {
    jest.clearAllMocks();
    trimPipe = new AuthenticationTrimPipe();
  });

  describe('When the trim pipe receives anything of a type different to body', () => {
    it('Should leave the data untouched', () => {
      values = trimPipe.transform(stubTrimPipe(), { type: 'custom' });
      expect(values).toEqual(stubTrimPipe());
    });
  });

  describe('When the trim pipe receives a body', () => {
    beforeEach(() => (values = trimPipe.transform(stubTrimPipe(), { type: 'body' })));

    it('Should leave passwords untouched', () =>
      expect(values.password).toBe(stubTrimPipe().password));

    it('should trim any other string property', () =>
      expect(values.test).toBe(stubTrimPipe().test.trim()));
  });
});
