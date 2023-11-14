import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getContrastingColor, stringToColour } from "@/lib/utils";
import type { IUser } from "@/lib/types";

interface SmallAvatarProps {
  user: IUser;
  className?: string;
}
export const SmallAvatar = ({ user, className }: SmallAvatarProps) => {
  const userName = user.name ?? user.email;

  if (!userName) {
    return null;
  }
  const bgColour = stringToColour(userName);
  const color = getContrastingColor(bgColour);

  return (
    <Avatar
      className={`-z-1 flex h-8 w-8 items-center align-middle ${className}`}>
      <AvatarImage
        src={user?.avatar}
        alt={user?.name + "_avatar"}
        className="h-full w-full object-cover"
      />
      <AvatarFallback
        className={`text-md font-bold  ${className} flex h-full w-full items-center justify-center`}
        style={{ backgroundColor: bgColour, color }}>
        {userName?.[0]}
      </AvatarFallback>
    </Avatar>
  );
};
