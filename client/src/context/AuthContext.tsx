import React, { createContext, useContext, useEffect, useState } from "react";

// import { User } from "@supabase/supabase-js";
// import supabase from "@/lib/supabase";
// import { useUserContext } from "@/context/AuthContext";

// import { useUserContext } from "@/context/AuthContext";

// import { updateUserProfile } from "@/lib/utils";
import { IUser } from "@/lib/types";
import { getCurrentUser } from "@/lib/supabase/api";
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
  logout: React.Dispatch<React.SetStateAction<undefined>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export const AuthContext = createContext<IContextType>(INITIAL_STATE);

// let isRegistering = false;

// const registerGoogleUser = async (user: User | null) => {
//   const { data, error: registerUserError } = await supabase
//     .from("profiles")
//     .insert([
//       {
//         name: user?.user_metadata?.full_name,
//         email: user?.email,
//         avatar: user?.user_metadata?.avatar_url,
//         user_id: user?.id,
//       },
//     ])
//     .select("name, avatar, id:user_id, email");

//   if (registerUserError) {
//     throw new Error(registerUserError.message);
//   }
//   return { ...data[0] };
// };

// const registerUser = async (user: User | undefined) => {
//   try {
//     if (!isRegistering && user) {
//       isRegistering = true;
//       if (user?.app_metadata.provider === "google") {
//         return await registerGoogleUser(user);
//       } else {
//         return await updateUserProfile(user);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  // const { user: userProfile, addUser } = useUserContext();
  // const navigate = useNavigate();
  const { mutate: signOut } = useSignOut();
  const [user, setUser] = useState<IUser | undefined>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();

      console.log("currentUser", currentUser);

      if (currentUser) {
        setUser({
          id: currentUser.id,
          name: currentUser.user_metadata.full_name,
          email: currentUser.email ?? "",
          avatar: currentUser.user_metadata.avatar_url,
        });

        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(currentUser));
        return true;
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
      // navigate("/sign-in");
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
  // const profileChannel = supabase
  //   .channel("profiles")
  //   .on(
  //     "postgres_changes",
  //     { event: "UPDATE", schema: "public", table: "profiles" },
  //     async (payload) => {
  //       if (payload.new.user_id === userProfile?.id) {
  //         const { data: updatedUser, error } = await supabase
  //           .from("profiles")
  //           .select(
  //             `*,
  //               avatar,
  //             id:user_id
  //             `
  //           )
  //           .eq("user_id", userProfile?.id)
  //           .single();
  //         if (error) {
  //           return console.log(error.message);
  //         }
  //         addUser(updatedUser);
  //       }
  //     }
  //   )
  //   .subscribe();

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     addUser(session?.user ?? null);
  //   });
  //   const { data: authListener } = supabase.auth.onAuthStateChange(
  //     async (event, session) => {
  //       console.log("event", event, "session", session);
  //       if (event === "SIGNED_IN") {
  //         // debugger;
  //         if (!session?.user?.id) {
  //           return;
  //         }

  //         const { data: currentUser, error } = await supabase
  //           .from("profiles")
  //           .select("name, avatar, id:user_id, email")
  //           .eq("user_id", session?.user?.id);
  //         if (error) {
  //           throw new Error(error.message);
  //         }

  //         if (!currentUser?.length) {
  //           const registeredUser = await registerUser(session?.user);
  //           addUser(registeredUser ?? null);
  //         } else {
  //           addUser(currentUser?.[0] ?? null);
  //         }
  //       } else if (event === "SIGNED_OUT") {
  //         addUser(null);
  //       }
  //     }
  //   );

  // return () => {
  //   authListener.subscription.unsubscribe();
  //   supabase.removeChannel(profileChannel);
  // };
  // }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUserContext = () => useContext(AuthContext);
