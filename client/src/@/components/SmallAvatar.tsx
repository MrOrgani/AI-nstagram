import React from "react";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getContrastingColor, stringToColour } from "../lib/utils";
import type { User } from "../lib/types";

interface SmallAvatarProps {
  user: User;
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
      className={`w-8 h-8 flex items-center align-middle -z-1 ${className}`}
    >
      <AvatarImage
        src={user?.avatar}
        alt={user?.name + "_avatar"}
        className="w-full h-full "
      />
      <AvatarFallback
        className={`text-md font-bold w-full h-full flex items-center justify-center text-center`}
        style={{ backgroundColor: bgColour, color }}
      >
        <span>{userName[0]}</span>
      </AvatarFallback>
    </Avatar>
  );
};
