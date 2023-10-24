import { googleLogout } from "@react-oauth/google";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "./ui/menubar";
import supabase from "../../supabase";
import useAuthStore from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { SmallAvatar } from "./SmallAvatar";
import { Icons } from "./ui/icons";

const PopoverMenu = () => {
  const { userProfile, logout } = useAuthStore();

  const navigate = useNavigate();

  if (!userProfile) {
    return null;
  }

  return (
    <Menubar className="border-none">
      <MenubarMenu>
        <MenubarTrigger className="p-0 rounded-full">
          <SmallAvatar user={userProfile} />
        </MenubarTrigger>
        <MenubarContent>
          <Link to={`/${userProfile.id}`}>
            <MenubarItem>
              <Icons.profile />
              My Profile
            </MenubarItem>
          </Link>
          <MenubarSeparator />
          <MenubarItem
            onClick={async () => {
              googleLogout();
              await supabase.removeAllChannels();
              const { error } = await supabase.auth.signOut();

              if (error) {
                console.log(error);
              }
              logout();
              navigate("/");
            }}
          >
            <Icons.logout />
            Log out
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default PopoverMenu;
