import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import preview from "../../assets/preview.png";
import Loader from "./Loader";
import { Textarea } from "./ui/textarea";
import { RiOpenaiFill } from "react-icons/ri";
import { IoCloseSharp, IoOpenOutline } from "react-icons/io5";

const PostDialog = () => {
  const [form, setForm] = useState<{
    name: string;
    prompt: string;
    photo: string;
  }>({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImg, setGeneratingImg] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateImg = async () => {
    if (form.prompt) {
      setGeneratingImg(true);
      try {
        const res = await fetch(`https://van-gan.onrender.com/api/v1/dalle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });
        const data = (await res.json()) as { photo: string };

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-0.5 rounded-md ">
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
                  onClick={deleteImg}
                >
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
            onClick={generateImg}
            className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-0.5 rounded-md "
          >
            <div className="flex h-full w-full items-center justify-center bg-white back rounded-md p-4 text-md  text-[#262626]">
              <span className="mx-1">
                {generatingImg ? "Generating..." : "Generate"}
              </span>
              <RiOpenaiFill />
            </div>
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-md "
            disabled={!form.photo}
          >
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
