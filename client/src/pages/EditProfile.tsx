import { ProfileForm } from "@/components/forms/ProfileForm";
import { Card } from "@/components/ui/card";

const EditProfile = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Card className=" w-full space-y-8 bg-white shadow-feed-post md:w-2/3 lg:w-1/2 xl:w-1/3">
        <div className=" mx-5 flex flex-col  items-center justify-center">
          <ProfileForm />
        </div>
      </Card>
    </div>
  );
};

export default EditProfile;
