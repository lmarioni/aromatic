import React, {createContext, useState} from 'react';
import Cookies from 'js-cookie'
export const Context = createContext();

const Provider = ({children}) => {

  const [token, setToken] = useState(() => {
    const tk = Cookies.get('token')
    if(tk){
      return tk;
    }else{
      return ''
    }
  })

  const [isAuth, setIsAuth] = useState(() => {
    if(Cookies.get('token')){
      return true
    }else{
      return false
    }
  });

  //en activateAuth() sacar sessionStorage y usar cookies que ya estan seteadas
  const value = {
      isAuth,
      token,
      activateAuth: (tkn) => {
        Cookies.set('token',tkn);
        setIsAuth(true)
        setToken(tkn)
      },
      removeAuth: () =>{
        setIsAuth(false)
        Cookies.remove('token')
      }
  }

  return(
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export default {
  Provider,
  Consumer: Context.Consumer
};
