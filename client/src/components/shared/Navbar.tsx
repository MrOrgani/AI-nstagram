import React from "react";
import { Link } from "react-router-dom";
import PostButton from "./PostButton";

import AInstagramLogo from "@/assets/AInstagramLogo.svg";

import LoginModal from "./LoginModal";
import PopoverMenu from "./PopoverMenu";
import { useUserContext } from "@/context/AuthContext";

const Navbar = () => {
  const { user: userProfile } = useUserContext();

  return (
    <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4  top-0 fixed z-50 border-b border-b-gray-300">
      <Link to="/">
        <img src={AInstagramLogo} alt={"logo"} className="w-20" />
      </Link>
      <PostButton />

      {userProfile?.id ? <PopoverMenu /> : <LoginModal displayButton={true} />}
    </header>
  );
};

export default Navbar;
