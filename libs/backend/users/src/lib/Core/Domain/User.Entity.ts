import { hashSync, verifySync } from '@node-rs/argon2';

import { OneTimePasswordEntity } from './OneTimePassword.Entity';
import { SessionEntity } from './Session.Entity';

const OTP_DEBOUNCE = 1000 * 60 * 10; // 10 minutes

// User entity, its used to maintain consistency when creating sessions
export class UserEntity {
  constructor(
    private readonly _id: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _name: string,
    private _email: string,
    private _emailVerified: boolean,
    private _passwordHash: string,
    private _role: string,
    private _emailVerificationCode: OneTimePasswordEntity | null,
    private _passwordResetCode: OneTimePasswordEntity | null,
    private readonly _sessions: SessionEntity[]
  ) {}

  get Id() { return this._id; } // prettier-ignore
  get CreatedAt() { return this._createdAt; } // prettier-ignore
  get UpdatedAt() { return this._updatedAt; } // prettier-ignore
  get Name() { return this._name; } // prettier-ignore
  get Email() { return this._email; } // prettier-ignore
  get EmailVerified() { return this._emailVerified; } // prettier-ignore
  get EmailVerificationCode() { return this._emailVerificationCode; } // prettier-ignore
  get PasswordHash() { return this._passwordHash; } // prettier-ignore
  get PasswordResetCode() { return this._passwordResetCode; } // prettier-ignore
  get Role() { return this._role; } // prettier-ignore
  get Sessions() { return this._sessions; } // prettier-ignore

  public static create(
    id: string,
    email: string,
    name: string,
    password: string,
    role: string
  ): UserEntity {
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
      realRole,
      null,
      null,
      []
    );
  }

  public static getFromDb(data: {
    info: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      email: string;
      emailVerified: boolean;
      passwordHash: string;
      role: string;
    };
    email_verification: {
      createdAt: Date;
      hashedCode: string;
    } | null;
    password_reset: {
      createdAt: Date;
      hashedCode: string;
    } | null;
    sessions: { id: string; expiresAt: Date; permanentSession: boolean }[];
  }) {
    const email_verification = data.email_verification
      ? OneTimePasswordEntity.getFromDb(
          data.email_verification.hashedCode,
          data.email_verification.createdAt
        )
      : null;
    const password_reset = data.password_reset
      ? OneTimePasswordEntity.getFromDb(
          data.password_reset.hashedCode,
          data.password_reset.createdAt
        )
      : null;
    const sessions = data.sessions.map((x) =>
      SessionEntity.getFromDb(x.id, x.permanentSession, x.expiresAt)
    );

    return new UserEntity(
      data.info.id,
      data.info.createdAt,
      data.info.updatedAt,
      data.info.name,
      data.info.email,
      data.info.emailVerified,
      data.info.passwordHash,
      data.info.role,
      email_verification,
      password_reset,
      sessions
    );
  }

  private static hashPassword = (password: string): string =>
    hashSync(password, { memoryCost: 19456, timeCost: 5, outputLen: 32, parallelism: 1 });

  /** Validates password and  */
  public addSession(
    password: string,
    sessionId: string,
    isPermanent: boolean
  ): SessionEntity | null {
    const validPass = verifySync(this._passwordHash, password);
    if (!validPass) return null;

    // TODO: Limit session amount
    const session = SessionEntity.create(sessionId, isPermanent);
    this._sessions.push(SessionEntity.create(sessionId, isPermanent));
    return session;
  }

  public deleteSession(sessionId: string): void {
    const session = this._sessions.find((x) => x.EncodedId === sessionId);
    if (!session) return;

    return session.delete();
  }

  public deleteAllSessions(): void {
    this._sessions.forEach((x) => x.delete());
  }

  /** Creates a verification code if no code was generated in OTP_DEBOUNCE */
  public generateEmailVerification(code: string): boolean {
    if (!this._emailVerificationCode) {
      this._emailVerificationCode = OneTimePasswordEntity.create(code);
      return true;
    }

    const minimumTime = new Date(Date.now() - OTP_DEBOUNCE).getTime();
    if (this._emailVerificationCode.CreatedAt.getTime() > minimumTime) return false;

    this._emailVerificationCode.refresh(code);
    return true;
  }

  /** Creates a verification code if no code was generated in OTP_DEBOUNCE */
  public generatePasswordResetCode(code: string): boolean {
    if (!this._passwordResetCode) {
      this._passwordResetCode = OneTimePasswordEntity.create(code);
      return true;
    }

    const minimumTime = new Date(Date.now() - OTP_DEBOUNCE).getTime();
    if (this._passwordResetCode.CreatedAt.getTime() > minimumTime) return false;

    this._passwordResetCode.refresh(code);
    return true;
  }

  /** Updates the info: returns if there are any updates to be saved */
  public setBasicInfo(data: { name?: string; email?: string }): boolean {
    let updated = false;

    if (data.name && data.name !== this._name) {
      this._name = data.name;
      updated = true;
    }

    // If the email is changed, then it needs to be reverified
    // it also removes the current verification code
    if (data.email && data.email !== this._email) {
      this._email = data.email;
      this._emailVerified = false;
      if (this._emailVerificationCode) this._emailVerificationCode.delete();
      updated = true;
    }

    if (updated) this._updatedAt = new Date();
    return updated;
  }

  /** Refreshes session */
  public refreshSession(sessionId: string): SessionEntity | null {
    const session = this._sessions.find((x) => x.EncodedId === sessionId);
    if (!session) return null;

    session.refresh();
    return session;
  }

  /** If the code is valid, the password gets changed */
  public resetPassword(code: string, newPassword: string): boolean {
    if (!this._passwordResetCode) return false;

    const status = this._passwordResetCode.verify(code);
    if (!status) return false;

    // If verification succeeds replace password and remove code
    this._passwordHash = UserEntity.hashPassword(newPassword);
    this._passwordResetCode.delete();
    return true;
  }

  /** Updates the password, requires the previous password to work */
  public setPassword(oldPassword: string, newPassword: string): boolean {
    const valid = verifySync(this._passwordHash, oldPassword);
    if (!valid) return false;

    this._passwordHash = UserEntity.hashPassword(newPassword);
    this._updatedAt = new Date();
    return true;
  }

  /** Verifies the email */
  public verifyEmail(code: string): boolean {
    if (!this._emailVerificationCode) return false;

    const status = this._emailVerificationCode.verify(code);
    if (!status) return false;

    // If verification succeeds, verify the account and remove code
    this._emailVerified = true;
    this._emailVerificationCode.delete();
    return true;
  }
}
