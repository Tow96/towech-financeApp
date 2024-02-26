jest.mock('oslo/crypto', () => ({
  generateRandomString: (s: string) => s,
  alphabet: () => [],
}));
