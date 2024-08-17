import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuthComp = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [activeAuthComp, setActiveAuthComp] = useState(
    localStorage.getItem("activeAuthComp") || 0
  );

  useEffect(() => {
    localStorage.setItem("activeAuthComp", activeAuthComp);
  }, [activeAuthComp]);

  return (
    <AuthContext.Provider
      value={{ activeAuthComp, setActiveAuthComp }}
    >
      {children}
    </AuthContext.Provider>
  );
};