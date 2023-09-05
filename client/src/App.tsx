import React from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  // UserButton,
  // useUser,
  RedirectToSignIn,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { Home } from "./pages";

import AInstagramLogo from "./assets/AInstagramLogo.svg";

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw "Missing Publishable Key";
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <Welcome />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

function Welcome() {
  return (
    <BrowserRouter>
      <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-blue-500">
        <Link to="/">
          <img src={AInstagramLogo} alt={"logo"} className="w-20" />
        </Link>
        <SignedIn>
          {/* Mount the UserButton component */}
          <UserButton />
        </SignedIn>
        <SignedOut>
          {/* Signed out users get sign in button */}
          <SignInButton />
        </SignedOut>
      </header>
      <main className="sm:p-8 px-4 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/create-post" element={<CreatePost />} /> */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
