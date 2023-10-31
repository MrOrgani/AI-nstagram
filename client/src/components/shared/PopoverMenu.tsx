import { googleLogout } from "@react-oauth/google";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import supabase from "@/lib/supabase";
import { useUserContext } from "@/context/AuthContext";

import { Link, useNavigate } from "react-router-dom";
import { SmallAvatar } from "@/components/shared/SmallAvatar";
import { Icons } from "@/components/ui/icons";

const PopoverMenu = () => {
  const { user: userProfile, logout } = useUserContext();

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
            }}>
            <Icons.logout />
            Log out
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default PopoverMenu;
