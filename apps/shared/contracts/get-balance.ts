/** Item that represents the balance on a specific date
 * @property {Date} date - Day being displayed
 * @property {Number} balance - Amount in cents
 */
export interface BalanceItem {
  date: Date;
  balance: number;
}

export enum StatTimeframe {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  MAX = 'max'
}
export interface GetBalanceRequest {
  timeframe: StatTimeframe;
}

/** Response from the Get Balance request */
export type GetBalanceResponse = BalanceItem[];
