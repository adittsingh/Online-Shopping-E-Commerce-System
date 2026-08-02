export const formatINR = (n) =>
  '₹' +
  Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

export const VOUCHER_CODE = 'INDEPENDENCE25';
export const VOUCHER_MIN_ITEMS = 25000;
export const VOUCHER_DISCOUNT = 10000;
