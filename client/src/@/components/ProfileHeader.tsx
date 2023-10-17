import React from "react";

export const ProfileHeader = ({ picture, name, nbOfPosts }) => {
  return (
    <header className="flex mb-11 h-[182px]">
      <div className="rounded-full mr-7 flex justify-center grow-[1] items-center ">
        <div className="flex ">
          <img
            className="h-[150px] w-[150px] rounded-full"
            src={picture}
            alt="avatar"
          />
        </div>
      </div>
      <section className="grow-[2] flex flex-col mt-4">
        <div className="font-normal text-xl mb-5">{name}</div>
        <span className="text-base">
          <span className="font-semibold">{nbOfPosts}</span> posts
        </span>
      </section>
    </header>
  );
};
