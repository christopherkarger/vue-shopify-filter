import moneyFormats from './moneyFormats';

export default (amount, currency) => {
  const moneyFormat = moneyFormats[currency].money_format;
  const newAmountValue = moneyFormat.replace('{{amount}}', amount);
  return newAmountValue;
}