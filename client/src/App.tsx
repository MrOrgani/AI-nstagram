import React, { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Profile } from "./pages";

import Navbar from "./@/components/Navbar";
import supabase from "./supabase";
import useAuthStore from "./store/authStore";
import { Toaster } from "./@/components/ui/toaster";

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw "Missing Publishable Key";
}

function App() {
  const { addUser } = useAuthStore();

  useEffect(() => {
    const session = supabase.auth.getSession();
    addUser(session?.data?.session.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          const {
            data: { name },
          } = await supabase
            .from("profiles")
            .select("name")
            .eq("user_id", session?.user?.id)
            .single();
          const currentUser = session?.user;
          addUser({ ...currentUser, name } ?? null);
        } else if (event === "SIGNED_OUT") {
          addUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [addUser]);

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_PUBLIC_GOOGLE_API_TOKEN}
    >
      <BrowserRouter>
        <Navbar />
        <Toaster />
        <main className=" px-4 w-full bg-white min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
