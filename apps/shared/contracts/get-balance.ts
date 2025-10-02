/** Item that represents the balance on a specific date
 * @property {Date} date - Day being displayed
 * @property {Number} balance - Amount in cents
 */
export interface BalanceItem {
  date: Date;
  balance: number;
}

/** Response from the Get Balance Weekly request */
export type GetBalanceWeekResponse = BalanceItem[];
