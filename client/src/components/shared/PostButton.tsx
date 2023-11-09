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
import { GenerateImg } from "@/lib/types";
import { Eraser, PlusSquare, X } from "lucide-react";
import { Icons } from "../ui/icons";
import { useToast } from "../ui/use-toast";

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));

const PostButton = () => {
  const { toast } = useToast();
  const { user: userProfile } = useUserContext();

  const { mutateAsync: publishNewPost, isLoading } = usePublishPost();

  const [open, setOpen] = useState(false);
  const [loginDialog, setLoginDialog] = useState(false);

  const [generatingImg, setGeneratingImg] = useState(false);
  const setLoginDialogCallback = (value: boolean) => setLoginDialog(value);

  const [form, setForm] = useState<{
    prompt: string;
    generatedImages: GenerateImg[];
  }>({
    prompt: "",
    generatedImages: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDialogOnOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen === false) {
      setForm({ ...form, generatedImages: [] });
      setGeneratingImg(false);
    }
  };

  const handleGenerateImg = async () => {
    if (!userProfile?.id) {
      setOpen(false);
      setLoginDialogCallback(true);
      return;
    }
    if (!form.prompt) {
      toast({
        title: "Please entre a prompt",
        variant: "destructive",
      });
    }

    setGeneratingImg(true);

    try {
      const { data, error } = await supabase.functions.invoke<{
        generatedImages: Array<GenerateImg>;
      }>("openai", {
        body: JSON.stringify({
          prompt: form.prompt,
        }),
      });

      if (error || !data) {
        toast({
          title: "Your prompt could not be generated",
          variant: "destructive",
        });
        throw new Error(error.message);
      }
      setForm({
        ...form,
        generatedImages: data?.generatedImages,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setGeneratingImg(false);
    }
  };

  const deleteImg = () => {
    setForm({ ...form, generatedImages: [] });
  };

  const handlePublishPost = async () => {
    if (!userProfile?.id) {
      setOpen(false);
      setLoginDialogCallback(true);
      return;
    }
    wait().then(() => setOpen(false));
    setForm({ generatedImages: [], prompt: "" });
    publishNewPost({
      prompt: form.generatedImages[0].revised_prompt,
      b64_json: `data:image/jpeg;base64,${form.generatedImages[0].b64_json}`,
      authorId: userProfile?.id,
    });
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
      <Dialog open={open} onOpenChange={handleDialogOnOpenChange}>
        <DialogTrigger asChild>
          <OpenDialogButton onClick={() => setOpen(true)}></OpenDialogButton>
        </DialogTrigger>
        <DialogOverlay className="fixed left-0 top-0 z-30 h-screen w-screen bg-black opacity-50" />
        <DialogContent className="fixed left-1/2 top-1/2 z-40 flex w-full -translate-x-1/2 -translate-y-1/2 transform flex-col space-x-4 space-y-4 rounded-md bg-white p-5 shadow-feed-post md:w-3/4 lg:w-1/2 xl:w-1/3">
          <DialogHeader>
            <DialogDescription>
              <span className="font-semibold text-black-pearl">
                Write down a prompt to generate a picture
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 place-items-stretch gap-4">
            <Textarea
              name="prompt"
              placeholder="Type your text here."
              className="col-start-1 col-end-5 items-center"
              onChange={handleChange}
              value={form.prompt}
            />
          </div>

          <div className="relative h-64 w-full place-self-center rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:w-64">
            {form.generatedImages.length > 0 &&
              form.generatedImages.map((image) => (
                <ImagePreviewDidsplay
                  img={image}
                  key={image.revised_prompt}
                  onClick={deleteImg}
                />
              ))}
            {form.generatedImages.length === 0 && (
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-contain opacity-40"
              />
            )}
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex items-center justify-center rounded-lg bg-[rgba(0,0,0,0.5)]">
                <Loader />
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-1">
            <EraseButton
              onClick={() => {
                setForm({ generatedImages: [], prompt: "" });
              }}
              disabled={!form.generatedImages.length && !form.prompt}
            />
            <GenerateImageButton
              onClick={handleGenerateImg}
              disabled={
                !form.prompt || generatingImg || form.generatedImages.length > 0
              }
              generatingImg={generatingImg}
            />
            <PublishButton
              onClick={handlePublishPost}
              disabled={!form.prompt || !form.generatedImages.length}
              isLoading={isLoading}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

function OpenDialogButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="rounded-md bg-black-pearl bg-gradient-to-r from-gradient-blue to-gradient-purple p-0.5">
      <div className="text-md flex h-full w-full items-center  justify-center rounded-md p-4  text-white">
        <span className="mx-1">Post</span>
        <PlusSquare />
      </div>
    </Button>
  );
}

function PublishButton({
  onClick,
  disabled,
  isLoading,
}: {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      type="submit"
      className=" rounded-md bg-gradient-to-r from-gradient-blue to-gradient-purple p-0.5 ">
      <div className="flex-center p-4 ">
        {isLoading ? (
          <>
            <Loader /> Loading...
          </>
        ) : (
          "Publish"
        )}
      </div>
    </Button>
  );
}

function GenerateImageButton({
  onClick,
  disabled,
  generatingImg,
}: {
  onClick: () => void;
  disabled: boolean;
  generatingImg: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="rounded-md bg-gradient-to-r from-gradient-blue to-gradient-purple p-0.5 ">
      <div className="text-md flex h-full w-full items-center justify-center rounded-md bg-white p-4 text-[#262626]">
        <span className="mx-1">
          {generatingImg ? "Generating..." : "Generate"}
        </span>
        <Icons.openai className="h-5 w-8" />
      </div>
    </Button>
  );
}

function EraseButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="rounded-md bg-gradient-to-r from-[#FF0000] to-red-300 p-0.5 ">
      <div className="text-md flex h-full w-full items-center justify-center rounded-md p-4 text-white">
        <span className="mx-1">Erase</span>
        <Eraser className="h-5 w-8" />
      </div>
    </Button>
  );
}

function ImagePreviewDidsplay({
  img,
  onClick: deleteImg,
}: {
  img: GenerateImg;
  onClick: () => void;
}) {
  return (
    <div className="group flex">
      <img
        src={`data:image/jpeg;base64,${img.b64_json}`}
        alt={img.revised_prompt}
        className="block h-full w-full object-contain"
      />
      <div className="hidden group-hover:block ">
        <div
          className="full-rounded text-md absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 font-bold text-white"
          onClick={deleteImg}>
          <X />
        </div>
      </div>
    </div>
  );
}

export default PostButton;
