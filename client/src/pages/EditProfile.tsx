import React from "react";

import { ProfileForm } from "@/components/forms/ProfileForm";

const EditProfile = () => {
  return (
    <div className=" mt-20  h-full grow">
      <div className="flex flex-col space-y-8 h-full">
        <div className="mx-20 grid-rows-2 flex  flex-col grow">
          <div className="grow flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight my-3 grid-rows-3 flex-grow-0">
              Settings
            </h2>
            <div>
              <h3 className="text-lg font-medium">Edit Profile</h3>
              <p className="text-sm text-muted-foreground">
                This is how others will see you on the site.
              </p>
            </div>
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
