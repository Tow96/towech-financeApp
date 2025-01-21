// Entity to keep consistency in the sessions
import { encodeHexLowerCase } from '../../fake-oslo/encoding';
import { sha256 } from '../../fake-oslo/crypto/sha2';

type CreateSession = {
  token: string;
  userId: string;
  isPermanent: boolean;
};

export class SessionEntity {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _permanentSession: boolean,
    private _expiresAt: Date
  ) {}

  get Id(): string { return this._id; } // prettier-ignore
  get UserId(): string { return this._userId; } // prettier-ignore
  get ExpiresAt(): Date { return this._expiresAt; } // prettier-ignore
  get PermanentSession(): boolean { return this._permanentSession; } // prettier-ignore

  static create = ({ token, userId, isPermanent }: CreateSession): SessionEntity => {
    // Generate session id (encoded for storage)
    const id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    // Set expiration
    const PERMANENT_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days
    const TEMPORARY_DURATION = 1000 * 60 * 30; // 30 minutes
    const expiration = isPermanent
      ? new Date(Date.now() + PERMANENT_DURATION)
      : new Date(Date.now() + TEMPORARY_DURATION);

    return new SessionEntity(id, userId, isPermanent, expiration);
  };
}
