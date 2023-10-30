import React, { createContext, useContext, useEffect } from "react";

import { Session, User } from "@supabase/supabase-js";
import supabase from "../../supabase";
import useAuthStore from "../../store/authStore";
import { updateUserProfile } from "../lib/utils";

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
    throw new Error(registerUserError.message);
  }
  return { ...data[0] };
};

const registerUser = async (user: User | undefined) => {
  try {
    if (!isRegistering && user) {
      isRegistering = true;
      if (user?.app_metadata.provider === "google") {
        return await registerGoogleUser(user);
      } else {
        return await updateUserProfile(user);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const { userProfile, addUser } = useAuthStore();

  const profileChannel = supabase
    .channel("profiles")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "profiles" },
      async (payload) => {
        if (payload.new.user_id === userProfile?.id) {
          const { data: updatedUser, error } = await supabase
            .from("profiles")
            .select(
              `*,
                avatar,
              id:user_id
              `
            )
            .eq("user_id", userProfile?.id)
            .single();
          if (error) {
            return console.log(error.message);
          }
          addUser(updatedUser);
        }
      }
    )
    .subscribe();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      addUser(session?.user ?? null);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("event", event, "session", session);
        if (event === "SIGNED_IN") {
          // debugger;
          if (!session?.user?.id) {
            return;
          }

          const { data: currentUser, error } = await supabase
            .from("profiles")
            .select("name, avatar, id:user_id, email")
            .eq("user_id", session?.user?.id);
          if (error) {
            throw new Error(error.message);
          }

          if (!currentUser?.length) {
            const registeredUser = await registerUser(session?.user);
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
      supabase.removeChannel(profileChannel);
    };
  }, [addUser]);

  return <>{children}</>;
};

export const useUserContext = () => useContext(AuthContext);
