import { hashSync } from '@node-rs/argon2';

// User entity, its used to maintain consistency when creating sessions
export class UserEntity {
  constructor(
    private readonly _id: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _name: string,
    private readonly _email: string,
    private readonly _emailVerified: boolean,
    private readonly _passwordHash: string,
    private readonly _role: string
  ) {}

  get Id() { return this._id; } // prettier-ignore
  get CreatedAt() { return this._createdAt; } // prettier-ignore
  get UpdatedAt() { return this._updatedAt; } // prettier-ignore
  get Name() { return this._name } // prettier-ignore
  get Email() { return this._email } // prettier-ignore
  get EmailVerified() { return this._emailVerified } // prettier-ignore
  get PasswordHash() { return this._passwordHash } // prettier-ignore
  get Role() { return this._role } // prettier-ignore

  public static create(
    id: string,
    email: string,
    name: string,
    password: string,
    role: string
  ): UserEntity {
    // TODO: Validate all inputs
    const realRole = role === 'admin' ? 'admin' : 'user';
    const hashedPassword = this.hashPassword(password);

    return new UserEntity(
      id,
      new Date(),
      new Date(0),
      name,
      email,
      false,
      hashedPassword,
      realRole
    );
  }

  public static getFromDb(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    email: string,
    emailVerified: boolean,
    passwordHash: string,
    role: string
  ) {
    return new UserEntity(id, createdAt, updatedAt, name, email, emailVerified, passwordHash, role);
  }

  private static hashPassword = (password: string): string =>
    hashSync(password, { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 });
}
