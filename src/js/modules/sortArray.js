const sortArrayByName = (array, attribute) => {

  array.sort((a, b) => {
  
    let nameA = a;
    let nameB = b;
   
    if (attribute === 'alpha_az' || attribute === 'alpha_za') {
      nameA = a.title;
      nameB = b.title;
    }

    if (nameA === nameB) return 0;
    if (typeof nameA == 'string') { 
      nameA = nameA.split(' ')[0].toLowerCase().trim();
    }
    
    if (typeof nameB == 'string') {
      nameB = nameB.split(' ')[0].toLowerCase().trim();
    }

    if (attribute === 'alpha_za') {
      return  nameA < nameB ? 1 : -1;
    }

    return  nameA > nameB ? 1 : -1;
    
  });
  return array;
};

const sortArrayBySale = (array) => {
  array.sort((a, b) => {
    const productPriceA = parseFloat(a.variants[0].price);
    let comparePriceA = parseFloat(a.variants[0].compare_at_price);
    const productPriceB = parseFloat(b.variants[0].price);
    let comparePriceB = parseFloat(b.variants[0].compare_at_price);
    
    if (!comparePriceA || isNaN(comparePriceA) || productPriceA == comparePriceA) { comparePriceA = 0; }
    if (!comparePriceB || isNaN(comparePriceB) || productPriceB == comparePriceB) { comparePriceB = 0; }
    
    return  comparePriceB - comparePriceA;

  });
  
  return array;
  
};

const sortArrayByPrice = (array, attribute) => {
  array.sort((a, b) => {
    let priceA = parseFloat(a.variants[0].price);
    let priceB = parseFloat(b.variants[0].price);
    
    if (attribute == 'price_up') {
      return  priceA > priceB ? 1 : -1;
    }

    if (attribute == 'price_down') {
      return  priceA < priceB ? 1 : -1;
    }
  
  });

  return array;
};

const sortArrayBydate = (array, attribute) => {
  array.sort((a, b) => {
    let dateA = new Date(a.published_at).getTime();
    let dateB = new Date(b.published_at).getTime();
    
    return  dateA < dateB ? 1 : -1;
  });
  return array;
};

export default (array, filter, attribute) => {

  if (!filter || filter.value.length == 0) {
    
    if (attribute == 'sale') {
      // Sort by sale
      array = sortArrayBySale(array);
    } else if (attribute == 'alpha_az' || attribute == 'alpha_za') {
      // Sort by alpha
      array = sortArrayByName(array, attribute);

    } else if (attribute == 'price_up' || attribute == 'price_down') {
      array = sortArrayByPrice(array, attribute);
    } else if (attribute == 'new_down') {

      array = sortArrayBydate(array, attribute);

    } else {
      
      // Sort by name alphabetically
      array = sortArrayByName(array);
            
    }
    
  } else {
    array.sort((a, b) => {  
      return filter.value.indexOf(a) - filter.value.indexOf(b);
    });
  
  }

  return array;
}