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

import { useUserContext } from "@/context/AuthContext";

import supabase from "@/lib/supabase";
import LoginModal from "./LoginModal";
import { usePublishPost } from "@/lib/react-query/queries";
import { INewPost } from "@/lib/types";
import { PlusSquare, X } from "lucide-react";
import { Icons } from "../ui/icons";

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

const PostButton = () => {
  const { user: userProfile } = useUserContext();

  const { mutateAsync: publishNewPost, isLoading } = usePublishPost();

  const [open, setOpen] = useState(false);
  const [loginDialog, setLoginDialog] = useState(false);
  const setLoginDialogCallback = (value: boolean) => setLoginDialog(value);

  const [form, setForm] = useState<INewPost>({
    prompt: "",
    photo: "",
    authorId: "",
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
          photo: `data:image/jpeg;base64,${data.photoUrl}`,
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

  const deleteImg = () => {
    setForm({ ...form, photo: "" });
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
            setForm({ ...form, photo: "" });
            setGeneratingImg(false);
          }
        }}>
        <DialogTrigger asChild>
          <Button
            className="bg-gradient-to-r from-gradient-blue to-gradient-purple p-0.5 rounded-md bg-black-pearl"
            onClick={() => setOpen(true)}>
            <div className="flex h-full w-full items-center justify-center  rounded-md p-4 text-md  text-white">
              <span className="mx-1">Post</span>
              <PlusSquare />
            </div>
          </Button>
        </DialogTrigger>
        <DialogOverlay className="fixed bg-black w-screen h-screen top-0 left-0 z-49 opacity-50" />
        <DialogContent className="bg-white shadow-feed-post fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full sm:max-w-[425px]">
          <DialogHeader>
            <DialogDescription>
              <span className="font-semibold text-black-pearl">
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
            {form.photo ? (
              <div className="group flex">
                <img
                  src={form.photo}
                  alt={form.prompt}
                  className="block w-full  h-full object-contain"
                />
                <div className="hidden group-hover:block ">
                  <div
                    className="absolute right-1 top-1 bg-gray-500 full-rounded h-6 w-6 rounded-full flex justify-center items-center text-white text-md font-bold"
                    onClick={deleteImg}>
                    <X />
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
              className="bg-gradient-to-r from-gradient-blue to-gradient-purple p-0.5 rounded-md ">
              <div className="flex h-full w-full items-center justify-center bg-white back rounded-md p-4 text-md  text-[#262626]">
                <span className="mx-1">
                  {generatingImg ? "Generating..." : "Generate"}
                </span>
                <Icons.openai />
              </div>
            </Button>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                wait().then(() => setOpen(false));
                setForm({ ...form, photo: "" });
                publishNewPost({ ...form, authorId: userProfile?.id ?? "" });
              }}>
              <Button
                disabled={!form.prompt || !form.photo}
                type="submit"
                className="bg-gradient-to-r from-gradient-blue   to-gradient-purple rounded-md ">
                {isLoading ? (
                  <div className="flex-center gap-2">
                    <Loader /> Loading...
                  </div>
                ) : (
                  "Publish"
                )}
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostButton;
