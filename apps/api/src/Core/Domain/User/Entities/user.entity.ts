export class User {
  private _id: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _name: string;
  private _email: string;
  private _role: string;
  private _accountConfirmed: boolean;

  private constructor(createUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    accountConfirmed: boolean;
  }) {
    this._id = createUser.id;
    this._createdAt = new Date();
    this._updatedAt = new Date(0);
    this._name = createUser.name;
    this._email = createUser.email;
    this._role = createUser.role;
    this._accountConfirmed = createUser.accountConfirmed;
  }

  get Id(): string {
    return this._id;
  }

  get CreatedAt(): Date {
    return this._createdAt;
  }

  get UpdatedAt(): Date {
    return this._updatedAt;
  }

  get Name(): string {
    return this._name;
  }

  get Email(): string {
    return this._email;
  }

  get Role(): string {
    return this._role;
  }

  get AccountConfirmed(): boolean {
    return this._accountConfirmed;
  }

  // TODO: Validate attributes
  static create(createUser: { id: string; name: string; email: string; role: string }): User {
    return new User({
      id: createUser.id,
      role: createUser.role,
      name: createUser.name,
      email: createUser.email,
      accountConfirmed: false,
    });
  }
}
