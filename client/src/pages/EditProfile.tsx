import { ProfileForm } from "@/components/forms/ProfileForm";
import { Card } from "@/components/ui/card";

const EditProfile = () => {
  return (
    <div className="w-full flex align-middle justify-center h-full">
      <Card className="space-y-8 h-full w-full md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white shadow-feed-post">
        <div className=" mx-5 flex flex-col h-full justify-center items-center">
          <ProfileForm />
        </div>
      </Card>
    </div>
  );
};

export default EditProfile;
