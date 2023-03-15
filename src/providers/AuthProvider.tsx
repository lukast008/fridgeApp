import React, { useContext, useState } from "react";
import {getRealmApp} from "../database/realm";
import Realm from "realm";

const app = getRealmApp();

type AuthContextType = {
  logIn: (email: string, password: string) => Promise<Realm.User>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  user: Realm.User | null;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

function AuthProvider({children}: any) {

  const [user, setUser] = useState(app.currentUser);

  async function logIn(email: string, password: string) {
    const credentials = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(credentials);
    setUser(newUser);
    return newUser;
  }

  async function signUp(email: string, password: string) {
    await app.emailPasswordAuth.registerUser(email, password);
  }

  async function logOut() {
    if(user == null) return;
    await user.logOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{logIn, signUp, logOut, user}}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const authContext = useContext(AuthContext);
  if(authContext == null) {
    throw new Error("useAuth() called outside of an AuthProvider?");
  }
  return authContext;
}

export {AuthProvider, useAuth};
