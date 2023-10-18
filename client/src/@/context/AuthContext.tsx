import React, { createContext, useContext, useEffect, useState } from "react";

import { Session, User } from "@supabase/supabase-js";
import supabase from "../../supabase";
import useAuthStore from "../../store/authStore";

export const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
}>({
  user: null,
  session: null,
});

let isRegistering = false;

const registerGoogleUser = async (user: User | null) => {
  const { data, error: registerUserError } = await supabase
    .from("profiles")
    .insert([
      {
        name: user?.user_metadata?.full_name,
        email: user?.email,
        avatar: user?.user_metadata?.avatar_url,
        user_id: user?.id,
      },
    ])
    .select("name, avatar, id:user_id, email");

  if (registerUserError) {
    throw registerUserError;
  }
  console.log("registerGoogleUser", data);
  return { ...data[0] };
};

const registerUser = async (user: User | undefined) => {
  try {
    if (!isRegistering) {
      isRegistering = true;
      if (user?.app_metadata.provider === "google") {
        return registerGoogleUser(user);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const { addUser } = useAuthStore();

  useEffect(() => {
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   addUser(session?.user ?? null);
    // });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("event", event);
        if (event === "SIGNED_IN") {
          if (!session?.user?.id) {
            return;
          }

          const { data: currentUser, error } = await supabase
            .from("profiles")
            .select("name, avatar, id:user_id, email")
            .eq("user_id", session?.user?.id);

          if (!currentUser?.length) {
            const registeredUser = await registerUser(session?.user);
            console.log(
              " session?.user?.id",
              session?.user,
              currentUser,
              registeredUser
            );
            addUser(registeredUser ?? null);
          } else {
            addUser(currentUser?.[0] ?? null);
          }
        } else if (event === "SIGNED_OUT") {
          addUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [addUser]);

  return <>{children}</>;
};
