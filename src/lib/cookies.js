/**
 * To work with Cookies in browser, we don't have any good API, so this one could help
 * (I don't even test it 😄)
 */

const Cookie = {
  getItem: (key) => { 
    key = document.cookie.match(new RegExp("(?:^|; )" + key.replace(/([.$?*|{}()[\]\\/+^])/g, "$1") + "=([^;]*)")); return key ? decodeURIComponent(key[1]) : void 0 
  },
  
  setItem: (key, value, options = {}) => { 
    options = { path: "/", ...options }, 
    options.expires instanceof Date && (options.expires = options.expires.toUTCString()); 
    let keyValue = unescape(encodeURIComponent(key)) + "=" + unescape(encodeURIComponent(value));
    
    for (let option in options) { 
      keyValue += "; " + option; 
      let a = options[option]; 
      !0 !== a && (keyValue += "=" + a) 
    } 
    document.cookie = keyValue
  },
  
  deleteItem: (key) => { Cookie.setItem(key, "", { "max-age": -1 }) }
}

export default Cookie