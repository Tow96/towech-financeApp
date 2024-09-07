/** ParseMoneyAmount.tsx
 * Copyright (c) 2022, Towechlabs
 * All rights reserved
 * Function that converts an amount into a readable format
 */
const ParseMoneyAmount = (amount = 0): string => {
  // Adds cents
  const output = (Math.round(amount) / 100).toFixed(2);
  return output.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default ParseMoneyAmount;
