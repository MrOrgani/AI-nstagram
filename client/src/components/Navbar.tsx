import React from "react";
import { Link } from "react-router-dom";
import PostButton from "./PostButton";

import AInstagramLogo from "../assets/AInstagramLogo.svg";
import useAuthStore from "../store/authStore";
import LoginModal from "./LoginModal";
import PopoverMenu from "./PopoverMenu";

const Navbar = () => {
  const { userProfile } = useAuthStore();

  // console.log(userProfile);

  return (
    <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4  top-0 fixed z-50 border-b border-b-gray-300">
      <Link to="/">
        <img src={AInstagramLogo} alt={"logo"} className="w-20" />
      </Link>
      <PostButton />

      {userProfile ? <PopoverMenu /> : <LoginModal displayButton={true} />}
    </header>
  );
};

export default Navbar;
