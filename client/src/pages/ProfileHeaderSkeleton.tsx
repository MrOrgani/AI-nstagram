import React from "react";

export const ProfileHeaderSkeleton = () => {
  return (
    <header className="flex h-[182px]">
      <div className="rounded-full mr-7 flex justify-center grow-[1] items-center ">
        <div className="flex ">
          <div className="w-[150px] h-[150px] bg-gray-300 rounded-full"></div>
        </div>
      </div>
      <section className="grow-[2] flex flex-col mt-4">
        <div className="font-normal text-xl mb-5">
          <div className="w-24 h-4 bg-gray-300 rounded-full mb-2.5"></div>
          <div className="w-32 h-4 bg-gray-300 rounded-full"></div>
        </div>
        <div className="text-base">
          <div className="w-16 h-4 bg-gray-300 rounded-full"></div>
        </div>
      </section>
    </header>
  );
};
