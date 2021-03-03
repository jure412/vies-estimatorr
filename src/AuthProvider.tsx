import React, { useState, useContext, useMemo, useCallback } from 'react';
import GoTrue, { User } from 'gotrue-js';

const auth = new GoTrue({
  // APIUrl: "https://boring-mcnulty-25f906.netlify.app"
  APIUrl: "https://vies-estimator.netlify.app/"
});


type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, data: object) => Promise<User>;
};

const AuthContext = React.createContext<undefined | AuthContextType>(undefined);

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(auth.currentUser());
  console.log(user)

  const login = useCallback(
    async (email: string, password: string, remember: boolean) => {
      return auth.login(email, password, remember).then(setUser);
    },
    []
  );

  const logout = useCallback(
    async () => user?.logout().then(() => setUser(null)),
    [user]
  );

  const signup = useCallback(
    async (email: string, password: string, data: object) => {
      return auth.signup(email, password, data);
    },
    []
  );

  const context = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login,
      logout,
      signup,
    }),
    [user, login, logout, signup]
  );

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Missing provider 'AuthProvider'");
  }

  return context;
};

export { AuthProvider, useAuth };
