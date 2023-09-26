import React from "react";
import { Link } from "react-router-dom";
import PostButton from "./PostButton";

import AInstagramLogo from "../../assets/AInstagramLogo.svg";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";
import useAuthStore from "../../store/authStore";
import { googleLogout } from "@react-oauth/google";
import supabase from "../../supabase";

const Navbar = () => {
  const { userProfile, logout } = useAuthStore();
  return (
    <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-blue-500 fixed">
      <Link to="/">
        <img src={AInstagramLogo} alt={"logo"} className="w-20" />
      </Link>
      <PostButton />

      {userProfile ? (
        <div
          onClick={async () => {
            googleLogout();
            const { error } = await supabase.auth.signOut();
            if (error) {
              console.log(error);
            }
            logout();
          }}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          )}
        >
          Log out
        </div>
      ) : (
        <Link
          to={"/sign-in"}
          type="submit"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          )}
        >
          Sign in
        </Link>
      )}
    </header>
  );
};

export default Navbar;
