export default (number) => {
  let roundedNumber = Math.round(number * 100) / 100;
  const precisionArr = (roundedNumber + "").split(".");
  let precisionLength = (precisionArr.length > 1) ? precisionArr[1].length : 0;

  roundedNumber = String(roundedNumber);

  if (precisionLength == 1) {
    roundedNumber = roundedNumber + '0';
  }
  
  if (precisionLength == 0) {
    roundedNumber = roundedNumber + '.00';
  }

  return roundedNumber;  

}