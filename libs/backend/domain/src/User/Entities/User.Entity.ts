export class User {
  private constructor(
    private _id: string,
    private _name: string,
    private _email: string,
    private _passwordHash: string,
    private _emailVerified = false,
    private _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date(0)
  ) {}

  get Id(): string { return this._id; } // prettier-ignore
  get CreatedAt(): Date { return this._createdAt; } // prettier-ignore
  get UpdatedAt(): Date { return this._updatedAt; } // prettier-ignore
  get Email(): string { return this._email; } // prettier-ignore
  get EmailVerified(): boolean { return this._emailVerified; } // prettier-ignore
  get Name(): string { return this._name; } // prettier-ignore
  get PasswordHash(): string { return this._passwordHash; } // prettier-ignore

  // TODO: Validate attributes
  static create = (createUser: {
    id: string;
    name: string;
    email: string;
    password: string;
  }): User => new User(createUser.id, createUser.name, createUser.email, createUser.password);

  static fromDb = (data: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    passwordHash: string;
  }): User =>
    new User(
      data.id,
      data.name,
      data.email,
      data.passwordHash,
      data.emailVerified,
      data.createdAt,
      data.updatedAt
    );
}
