export default (cname) => {
  let cookie;
  
  if (!Array.isArray(cname)) { 
    cname = [cname];
  }

  if (window.hasOwnProperty('Cookies')) {
    const cookies = window.Cookies();
    
    cname.forEach(element => {
      if (cookies.hasOwnProperty(element)) {
        cookie = cookies[element];
      }
    });
      
    
  } else {
    cname.forEach(element => {
      const name = element + "=";
      const ca = document.cookie.split(';');
      const caLength = ca.length;

      for (let i = 0; i < caLength; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          cookie = c.substring(name.length, c.length);
        }
      }
    }); 
  
  }

  return cookie;
}