import React, { useState } from "react";
import { SmallAvatar } from "@/components/shared/SmallAvatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useUpdateUser } from "@/lib/react-query/queries";
import { Loader } from "lucide-react";

interface Inputs {
  username: string;
  avatar: FileList;
}
export const ProfileForm = () => {
  const { user: userProfile, setUser } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync, isLoading } = useUpdateUser();

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
    if (Object.keys(inputErrors).length > 0 || !userProfile?.id) return;

    const { username, avatar } = inputs;
    const file: File | string | undefined = avatar?.[0];

    const updatedUser = await mutateAsync({
      ...userProfile,
      username,
      currentAvatarName: userProfile?.avatar ?? undefined,
      newAvatar: file,
    });

    setUser(updatedUser);
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
      <Button type="submit" className="shad-button_primary">
        {isLoading ? (
          <div className="flex-center gap-2">
            <Loader /> Loading...
          </div>
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
};