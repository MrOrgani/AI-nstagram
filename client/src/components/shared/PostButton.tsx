import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import preview from "@/assets/preview.png";
import Loader from "./Loader";
import { Textarea } from "@/components/ui/textarea";
import { RiOpenaiFill } from "react-icons/ri";
import { IoCloseSharp, IoOpenOutline } from "react-icons/io5";
// import { useUserContext } from "@/context/AuthContext";

import { useUserContext } from "@/context/AuthContext";

import supabase from "@/lib/supabase";
import LoginModal from "./LoginModal";
import { dataUrlToFile } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query/QueryProvider";
import { useLocation } from "react-router-dom";

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

const PostButton = () => {
  const location = useLocation();
  // console.log("location", location);
  const { user: userProfile } = useUserContext();

  const [open, setOpen] = useState(false);
  const [loginDialog, setLoginDialog] = useState(false);
  const setLoginDialogCallback = (value: boolean) => setLoginDialog(value);

  const [form, setForm] = useState<{
    name: string;
    prompt: string;
    photoUrl: string;
  }>({
    name: "",
    prompt: "",
    photoUrl: "",
  });
  const [generatingImg, setGeneratingImg] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerateImg = async () => {
    if (form.prompt) {
      setGeneratingImg(true);

      try {
        const { data, error } = await supabase.functions.invoke("openai", {
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        setForm({
          ...form,
          photoUrl: `data:image/jpeg;base64,${data.photoUrl}`,
        });
        if (error) {
          throw new Error(error.message);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please entre a prompt");
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      console.log("mutationFn 1️⃣");
      const fileName = `${userProfile?.id}_${Date.now()}`;
      const fileImage = await dataUrlToFile(form.photoUrl, fileName);
      const { data } = await supabase.storage
        .from("ai-stagram-bucket")
        .upload(fileName, fileImage);
      console.log("mutationFn 2️⃣", data);
      await supabase.from("posts").insert([
        {
          prompt: form.prompt,
          user_id: userProfile?.id,
          photo: data?.path,
        },
      ]);
    },
    // When mutate is called:
    onMutate: async (newPost) => {
      if (location.pathname === "/") {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ["feed-posts"] });

        // Snapshot the previous value
        const previousTodos = queryClient.getQueryData(["feed-posts"]);

        // Optimistically update to the new value
        queryClient.setQueryData(["feed-posts"], (old) => [...old, newPost]);

        // Return a context object with the snapshotted value
        return { previousTodos };
      } else {
        console.log("IN PROFILE, WE OPTIMISTIC UPDATE");
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ["user-profile"] });

        // Snapshot the previous value
        const previousTodos = queryClient.getQueryData(["user-profile"]);

        // Optimistically update to the new value
        queryClient.setQueryData(["user-profile"], (old) => {
          console.log(" queryClient.setQueryData(", old, newPost);
          return {
            ...old,
            posts: [
              ...old.posts,
              {
                id: Date.now().toString(),
                created_at: Date.now().toString(),
                user_id: userProfile?.id,
                prompt: form.prompt,
                comments: 0,
                likes: 0,
                photo: form.photoUrl,
                likedByUser: [],
              },
            ],
          };
        });

        // Return a context object with the snapshotted value
        return { previousTodos };
      }
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["feed-posts"], context?.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });

  // const handlePublishPost = async () => {
  //   try {
  //     if (!userProfile) {
  //       setLoginDialog(true);
  //       return null;
  //     }
  //     // const fileName = `${userProfile?.id}_${Date.now()}`;
  //     // const fileImage = await dataUrlToFile(form.photoUrl, fileName);
  //     // const { data } = await supabase.storage
  //     //   .from("ai-stagram-bucket")
  //     //   .upload(fileName, fileImage);
  //     // await supabase.from("posts").insert([
  //     //   {
  //     //     prompt: form.prompt,
  //     //     user_id: userProfile?.id,
  //     //     photo: data?.path,
  //     //   },
  //     // ]);
  //     setForm({ ...form, photoUrl: "" });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const deleteImg = () => {
    setForm({ ...form, photoUrl: "" });
  };

  return (
    <>
      {loginDialog ? (
        <LoginModal
          initialDisplay={true}
          displayButton={false}
          onClose={() => setLoginDialogCallback(false)}
        />
      ) : null}
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (isOpen === false) {
            setForm({ ...form, photoUrl: "" });
            setGeneratingImg(false);
          }
        }}>
        <DialogTrigger asChild>
          <Button
            className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-0.5 rounded-md "
            onClick={() => setOpen(true)}>
            <div className="flex h-full w-full items-center justify-center bg-white back rounded-md p-4 text-md  text-[#262626]">
              <span className="mx-1">Post</span>
              <IoOpenOutline />
            </div>
          </Button>
        </DialogTrigger>
        <DialogOverlay className="fixed bg-black w-screen h-screen top-0 left-0 z-49 opacity-50" />
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full sm:max-w-[425px]">
          <DialogHeader>
            <DialogDescription>
              <span className="font-semibold">
                Write down a prompt to generate a picture
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4 place-items-stretch  ">
            <Textarea
              name="prompt"
              placeholder="Type your text here."
              className=" items-center col-start-1 col-end-5 "
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 foxus:border-blue-500 w-64 p-3 h-64 place-self-center relative">
            {form.photoUrl ? (
              <div className="group flex">
                <img
                  src={form.photoUrl}
                  alt={form.prompt}
                  className="block w-full  h-full object-contain"
                />
                <div className="hidden group-hover:block ">
                  <div
                    className="absolute right-1 top-1 bg-gray-500 full-rounded h-6 w-6 rounded-full flex justify-center items-center text-white text-md font-bold"
                    onClick={deleteImg}>
                    <IoCloseSharp />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-full  h-full object-contain opacity-40"
              />
            )}
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleGenerateImg();
              }}
              className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-0.5 rounded-md ">
              <div className="flex h-full w-full items-center justify-center bg-white back rounded-md p-4 text-md  text-[#262626]">
                <span className="mx-1">
                  {generatingImg ? "Generating..." : "Generate"}
                </span>
                <RiOpenaiFill />
              </div>
            </Button>
            <form
              onSubmit={(event) => {
                wait().then(() => setOpen(false));
                event.preventDefault();
              }}>
              <Button
                className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-md "
                disabled={!form.photoUrl}
                onClick={() => mutation.mutate()}>
                Publish
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostButton;