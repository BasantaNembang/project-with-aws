import { createContext, ReactNode, useState, useContext, useEffect } from "react";
import Cookies from "universal-cookie";


export interface AuthContextDTO {
  jwtToken: string;
  SetjwtToken: React.Dispatch<React.SetStateAction<string>>;
}


export const AuthContext = createContext<AuthContextDTO | undefined>(undefined);

type ChildrenProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: ChildrenProviderProps) => {

  const [jwtToken, SetjwtToken] = useState("");

  const cookes = new Cookies();

   useEffect(()=>{

   }, [jwtToken]);




  const isAuthenticated = () => {
    const jwt = cookes.get("jwtToken");
    if (jwtToken || jwt) {
      return true;
    }
    else {
      return false;
    }
  }

  const data = {
    jwtToken, SetjwtToken, isAuthenticated
  }

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuthContexHook() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Error in Auth-Context");
  }
  return context;
}

