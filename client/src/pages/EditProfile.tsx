import React, { useState } from "react";
import { SmallAvatar } from "../@/components/SmallAvatar";
import useAuthStore from "../store/authStore";
import { Label } from "../@/components/ui/label";
import { Input } from "../@/components/ui/input";
import { Button } from "../@/components/ui/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

interface Inputs {
  username: string;
  avatar: FileList;
}

const ProfileForm = () => {
  const { userProfile } = useAuthStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  // onSubmit doit envoyer la photo de profil sur le storage de supabase,
  // le nom de l'utilisateur sur la database, et le lien de la photo de profil dans le champ avatar de la database
  const onSubmit: SubmitHandler<Inputs> = (data) =>
    console.log("data FORM", data);

  const [selectedImage, setSelectedImage] = useState<FileList | undefined>(
    undefined
  );

  console.log("errors", errors);
  if (!userProfile) {
    return null;
  }

  const imgSrc = selectedImage
    ? URL.createObjectURL(selectedImage[0])
    : userProfile?.avatar;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grow flex flex-col items-center justify-center">
        <div className="gap-x-8 mx-20">
          <div className="flex flex-col items-end justify-center h-full">
            <div className="flex">
              <SmallAvatar
                user={{ ...userProfile, avatar: imgSrc }}
                className="h-20 w-20"
              />
              <div className="ml-10">
                <Label htmlFor="picture">Changer ma photo de profil</Label>
                <Controller
                  control={control}
                  name={"avatar"}
                  defaultValue={selectedImage}
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <Input
                        {...field}
                        onChange={(event) => {
                          if (
                            !event.target.files ||
                            event.target.files.length === 0
                          ) {
                            setSelectedImage(undefined);
                            return;
                          }
                          console.log(event.target.files[0]);
                          onChange(event.target.files[0]);
                          setSelectedImage(event.target.files);
                        }}
                        type="file"
                        id="picture"
                        accept="image/*"
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex">
            <span>Username</span>
            <Input
              {...register("username", { required: true })}
              className="ml-10"
              id="username"
              type="text"
              defaultValue={userProfile?.name}
            />
          </div>
        </div>
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
};

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
