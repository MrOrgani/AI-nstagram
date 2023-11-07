import { Link, useLocation } from "react-router-dom";
import PostButton from "./PostButton";

import AInstagramLogo from "@/assets/AInstagramLogo.svg";

import LoginModal from "./LoginModal";
import PopoverMenu from "./PopoverMenu";
import { useUserContext } from "@/context/AuthContext";

const Navbar = () => {
  const { user: userProfile } = useUserContext();
  const location = useLocation();

  return (
    <nav className="flex-center fixed top-0 z-30 w-full shadow-navbar bg-black-pearl flex justify-between items-center sm:px-8 px-4 py-4   ">
      <Link to="/">
        <img src={AInstagramLogo} alt={"logo"} className="w-20 invert" />
      </Link>
      {location.pathname !== "/" && <PostButton />}

      {userProfile?.id ? <PopoverMenu /> : <LoginModal displayButton={true} />}
    </nav>
  );
};

export default Navbar;
