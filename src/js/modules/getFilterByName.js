export default (name, filterArray) => {
  let filterByName;
  filterArray.forEach(filter => {
    if (filter.name === name) {
      filterByName = filter;
    }    
  });
  return filterByName;
}