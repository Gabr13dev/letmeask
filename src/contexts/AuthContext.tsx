import { createContext, useState, useEffect, ReactNode } from "react";

import { auth, firebase } from "../services/firebase";

import { User } from '../models/user.model';

type AuthContextType = {
    user: User | undefined,
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
  }

  type AuthContextProviderProp = {
      children: ReactNode;
  }

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProp){
    const [user, setUser] = useState<User>();

    function initUser(user: any){
        const { displayName, photoURL, uid } = user;
    
            if (!displayName || !photoURL) {
              throw new Error("Missing information from Google Account");
            }
    
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL,
            });
      }
    
      useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          if(user){
            initUser(user);
          }
        })
    
        return () => {
          unsubscribe();
        }
    
      }, [])
    
      async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
    
        const result = await auth.signInWithPopup(provider);
    
          if (result.user) {
           initUser(result.user);
          }
      }

      async function signOut() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signOut();

        setUser(undefined);
      }


    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}