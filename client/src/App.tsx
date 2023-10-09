import React, { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages";

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
    console.log("getSession", session);
    addUser(session?.data?.session ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        addUser(currentUser ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_PUBLIC_GOOGLE_API_TOKEN}
    >
      <BrowserRouter>
        <Navbar />
        <Toaster />
        <main className=" px-4 w-full bg-[#f9fafe] min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
