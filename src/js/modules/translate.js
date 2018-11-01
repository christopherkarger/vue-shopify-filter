import globals from '../global-variables';

export default (filter, obj) => {
  const newValues = [];
  const lang = globals().language;
  if (typeof(obj) === 'string'){
    const newObj = [];
    newObj.push(obj);
    obj = newObj;
  }

  obj.forEach((value,index) => {
    const translateItem = filter.translate[lang];
    if (typeof(value) === 'string') {
      for (let i in translateItem) {
        if (value.indexOf(i) > -1) {
          value = value.replace(i, translateItem[i]);
        }
      }
    }
    newValues.push(value);
  });
  

  if (newValues.length == 1) {
    return newValues[0];
  } else {
    return newValues;  
  }

}