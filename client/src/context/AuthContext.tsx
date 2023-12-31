import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/lib/types";
import { addUserToDB, getCurrentUser, getUserById } from "@/lib/supabase/api";
import { useSignOut } from "@/lib/react-query/queries";

export const INITIAL_USER = {
  id: "",
  name: "",
  email: "",
  avatar: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  logout: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser | undefined;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  logout: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export const AuthContext = createContext<IContextType>(INITIAL_STATE);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const { mutate: signOut } = useSignOut();
  const [user, setUser] = useState<IUser | undefined>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentUserSession = await getCurrentUser();
      if (!currentUserSession) return false;

      const currentUser = await getUserById(currentUserSession?.user.id ?? "");

      if (currentUser) {
        setUser({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.avatar,
        });

        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(currentUser));
        return true;
      } else {
        try {
          const createdUser = await addUserToDB({
            id: currentUserSession.user.id,
            email: currentUserSession.user.email!,
            name: currentUserSession.user.user_metadata.full_name,
            avatar: currentUserSession.user.user_metadata.avatar_url,
          });
          setUser({
            id: createdUser.id,
            email: createdUser.email || "",
            name: createdUser.name,
            avatar: createdUser.avatar,
          });
          return true;
        } catch (error) {
          console.log(error);
        }
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    signOut();
    setUser(undefined);
  };

  useEffect(() => {
    const userInCookies = localStorage.getItem("user");

    if (["[]", null, undefined].includes(userInCookies)) {
      setUser(undefined);
    }

    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUserContext = () => useContext(AuthContext);
