import { ProfileForm } from "@/components/forms/ProfileForm";

const EditProfile = () => {
  return (
    <div className="flex flex-col space-y-8 h-[calc(100vh-80px)]">
      <div className="grow mx-20 grid-rows-2 flex  flex-col h-full">
        <ProfileForm />
      </div>
    </div>
  );
};

export default EditProfile;
