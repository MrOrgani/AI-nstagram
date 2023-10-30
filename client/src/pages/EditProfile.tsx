import React, { useState } from "react";
import { SmallAvatar } from "../components/SmallAvatar";
import useAuthStore from "../store/authStore";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

interface Inputs {
  username: string;
  avatar: FileList;
}

const ProfileForm = () => {
  const { userProfile, addUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors: inputErrors },
  } = useForm<Inputs>();
  const [selectedImage, setSelectedImage] = useState<FileList | undefined>(
    undefined
  );

  const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
    if (Object.keys(inputErrors).length > 0) return;

    const { username, avatar } = inputs;
    const fileName = `${userProfile?.id}_${Date.now()}`;
    let file: File | string | undefined = avatar?.[0];
    if (file) {
      const { data: avatarData, error: errorUpload } = await supabase.storage
        .from("ai-stagram-bucket")
        .upload(`/avatar/${fileName}`, file, {
          upsert: true,
        });
      const { error: errorDelete } = await supabase.storage
        .from("ai-stagram-bucket")
        .remove([`${userProfile?.avatar}`]);
      if (errorUpload || errorDelete) {
        throw new Error(errorUpload?.message || errorDelete?.message);
      }

      const { data } = await supabase.storage
        .from("ai-stagram-bucket")
        .getPublicUrl(avatarData?.path);

      file = data.publicUrl;
    }

    const dataToUpdate = { ...(file && { avatar: file }), name: username };

    await supabase
      .from("profiles")
      .update(dataToUpdate)
      .eq("user_id", userProfile?.id);

    addUser({ ...userProfile, ...dataToUpdate });
    navigate(`/${userProfile?.id}/`);
  };

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
                          if (event.target.files[0].size > 10000000) {
                            setError("avatar", {
                              type: "custom",
                              message: "L'image est trop lourde",
                            });
                            return;
                          }
                          console.log(event.target.files);
                          onChange(event.target.files);
                          setSelectedImage(event.target.files);
                        }}
                        type="file"
                        id="picture"
                        accept="image/*"
                        multiple={false}
                      />
                    );
                  }}
                />
                {inputErrors.avatar && (
                  <span className="text-xs text-red-500">
                    {inputErrors.avatar.message}
                  </span>
                )}
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
            {inputErrors.username && (
              <span className="text-xs text-red-500">
                {inputErrors.username.message}
              </span>
            )}
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
