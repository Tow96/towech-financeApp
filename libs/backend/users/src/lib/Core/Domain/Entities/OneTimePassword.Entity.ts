import { hashSync, verifySync } from '@node-rs/argon2';
import { OTPModel } from '../Models';

export enum OTPStatus {
  'VALID' = 0,
  'EXPIRED' = 1,
  'UPDATED' = 2,
  'DELETED' = 3,
  'CREATED' = 4,
}

const CODE_DURATION = 1000 * 60 * 60 * 24; // 24 hrs

export class OneTimePasswordEntity {
  private constructor(
    private _codeHash: string,
    private _createdAt: Date,
    private _status: OTPStatus
  ) {}

  get CreatedAt() { return this._createdAt; } // prettier-ignore
  get CodeHash() { return this._codeHash; } // prettier-ignore
  get Status() { return this.updateStatus(); } // prettier-ignore

  public static create(code: string): OneTimePasswordEntity {
    const hashedCode = this.hashCode(code);

    return new OneTimePasswordEntity(hashedCode, new Date(), OTPStatus.CREATED);
  }

  public static getFromDb({ createdAt, hashedCode }: OTPModel): OneTimePasswordEntity {
    return new OneTimePasswordEntity(hashedCode, createdAt, OTPStatus.VALID);
  }

  private static hashCode = (code: string): string =>
    hashSync(code, { memoryCost: 8192, timeCost: 2, outputLen: 32, parallelism: 1 });

  private updateStatus(): OTPStatus {
    const expiration = this._createdAt.getTime() + CODE_DURATION;
    if (expiration < Date.now() && this._status !== OTPStatus.DELETED)
      this._status = OTPStatus.EXPIRED;

    return this._status;
  }

  /** Updates the code with a new one */
  public refresh(code: string): void {
    this._codeHash = OneTimePasswordEntity.hashCode(code);
    this._createdAt = new Date();
    this._status = OTPStatus.UPDATED;
  }

  public verify(code: string): boolean {
    if (this.updateStatus() === OTPStatus.EXPIRED) return false;

    return verifySync(this._codeHash, code);
  }

  public delete(): void {
    this._status = OTPStatus.DELETED;
  }
}
