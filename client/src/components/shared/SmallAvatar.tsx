import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getContrastingColor, stringToColour } from "@/lib/utils";
import type { IUser } from "@/lib/types";

interface SmallAvatarProps {
  user: IUser;
  className?: string;
}
export const SmallAvatar = ({ user, className }: SmallAvatarProps) => {
  const userName = user.name;

  if (!userName) {
    return null;
  }
  const bgColour = stringToColour(userName);
  const color = getContrastingColor(bgColour);

  return (
    <Avatar
      className={`w-8 h-8 flex items-center align-middle -z-1 ${className}`}>
      <AvatarImage
        src={user?.avatar}
        alt={user?.name + "_avatar"}
        className="object-cover w-full h-full"
      />
      <AvatarFallback
        className={`text-md font-bold  ${className} w-full h-full flex items-center justify-center`}
        style={{ backgroundColor: bgColour, color }}>
        {userName?.[0]}
      </AvatarFallback>
    </Avatar>
  );
};
