import React from "react";
import { SmallAvatar } from "./SmallAvatar";
import { User } from "../lib/types";

interface Props {
  user: User;
  nbOfPosts: number;
  children: React.ReactNode;
}

export const ProfileHeader: React.FC<Props> = ({
  user,
  nbOfPosts,
  children,
}) => {
  return (
    <header className="flex h-[182px]">
      <div className="rounded-full mr-7 flex justify-center grow-[1] items-center ">
        <div className="flex ">
          <SmallAvatar user={user} className="h-[150px] w-[150px]" />
        </div>
      </div>
      <section className="grow-[2] flex flex-col mt-4">
        <div className="font-normal text-xl mb-5">{user.name}</div>
        {children}
        <span className="text-base">
          <span className="font-semibold">{nbOfPosts}</span> posts
        </span>
      </section>
    </header>
  );
};
