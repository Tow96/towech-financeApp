import { sha256 } from '../../fake-oslo/crypto/sha2';
import { encodeHexLowerCase } from '../../fake-oslo/encoding';

const TEMPORARY_SESSION_DURATION = 1000 * 60 * 30; // 30 min
const PERMANENT_SESSION_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days

export enum SessionStatus {
  'VALID' = 0,
  'EXPIRED' = 1,
  'UPDATED' = 2,
  'DELETED' = 3,
  'CREATED' = 4,
}

export class SessionEntity {
  private constructor(
    private readonly _encodedId: string,
    private readonly _isPermanent: boolean,
    private _expiresAt: Date,
    private _status: SessionStatus
  ) {}

  get EncodedId() { return this._encodedId; } // prettier-ignore
  get IsPermanent() { return this._isPermanent; } // prettier-ignore
  get ExpiresAt() { return this._expiresAt; } // prettier-ignore
  get Status() { return this.updateStatus(); } // prettier-ignore

  public static create(id: string, isPermanent: boolean) {
    const encodedId = this.encodeId(id);
    const expiration = this.generateSessionExpiration(isPermanent);

    return new SessionEntity(encodedId, isPermanent, expiration, SessionStatus.CREATED);
  }

  public static getFromDb(id: string, isPermanent: boolean, expiresAt: Date) {
    return new SessionEntity(id, isPermanent, expiresAt, SessionStatus.VALID);
  }

  private updateStatus(): SessionStatus {
    if (this._expiresAt.getTime() < Date.now() && this._status !== SessionStatus.DELETED)
      this._status = SessionStatus.EXPIRED;

    return this._status;
  }

  public static encodeId = (token: string): string =>
    encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  private static generateSessionExpiration = (isPermanent: boolean) =>
    new Date(Date.now() + (isPermanent ? PERMANENT_SESSION_DURATION : TEMPORARY_SESSION_DURATION));

  /** Extends the expiration of the session */
  public refresh(): void {
    const tresholdTime = this._isPermanent
      ? this._expiresAt.getTime() - PERMANENT_SESSION_DURATION / 2
      : this._expiresAt.getTime() - TEMPORARY_SESSION_DURATION / 2;

    if (Date.now() < tresholdTime) return;

    this._expiresAt = SessionEntity.generateSessionExpiration(this._isPermanent);
    this._status = SessionStatus.UPDATED;
  }

  public delete(): void {
    this._status = SessionStatus.DELETED;
  }
}
