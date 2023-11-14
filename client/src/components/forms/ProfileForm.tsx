import { useState } from "react";
import { SmallAvatar } from "@/components/shared/SmallAvatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useUpdateUser } from "@/lib/react-query/queries";
import { Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileValidation } from "@/lib/validations";

export const ProfileForm = () => {
  const { user: userProfile, setUser } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync, isLoading } = useUpdateUser();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      username: userProfile?.name ?? "",
      avatar: undefined,
    },
  });
  const [selectedImage, setSelectedImage] = useState<FileList | undefined>(
    undefined
  );

  const onSubmit: SubmitHandler<z.infer<typeof ProfileValidation>> = async (
    inputs
  ) => {
    if (!userProfile?.id) return;

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-2 flex  w-full grow flex-col gap-40">
        <div>
          <h2 className="my-3 flex-grow-0 grid-rows-3 text-2xl font-bold tracking-tight">
            Settings
          </h2>
          <div>
            <h3 className="text-lg font-medium">Edit Profile</h3>
            <p className="text-sm text-muted-foreground">
              This is how others will see you on the site.
            </p>
          </div>
        </div>
        <div className="flex grow flex-col items-center justify-center gap-10">
          <div className="flex h-full flex-col justify-center ">
            <div className="gap-30 flex flex-col items-center justify-center">
              <Label htmlFor="avatar" className="cursor-pointer">
                <SmallAvatar
                  user={{ ...userProfile, avatar: imgSrc }}
                  className="h-20 w-20"
                />
              </Label>
              <Controller
                control={form.control}
                name={"avatar"}
                defaultValue={selectedImage}
                render={({ field: { onChange, value, ...field } }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <>
                          <Input
                            className="hidden"
                            {...field}
                            onChange={(event) => {
                              if (
                                !event.target.files ||
                                event.target.files.length === 0
                              ) {
                                setSelectedImage(undefined);
                                return;
                              }
                              onChange(event.target.files);
                              setSelectedImage(event.target.files);
                            }}
                            type="file"
                            id="avatar"
                            accept="image/*"
                          />
                          <FormMessage />
                        </>
                      </FormControl>
                      <FormDescription>
                        Change your profile picture.
                      </FormDescription>
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full md:px-10">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="shad-button_primary">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            "Save changes"
          )}
        </Button>
      </form>
    </Form>
  );
};
