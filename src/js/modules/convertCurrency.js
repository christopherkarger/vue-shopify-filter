import beautifyNumber from './beautifyNumber';

export default (currenciesObj, amount, from, to, beauty) => {
  const newValue = (parseFloat(amount) * parseFloat(currenciesObj[from])) / parseFloat(currenciesObj[to]);
  if (beauty) {
    return beautifyNumber(newValue);
  }
  return newValue;
  
}