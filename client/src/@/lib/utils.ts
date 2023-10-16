import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import * as FileSaver from "file-saver";
import jwtDecode from "jwt-decode";
import { createClient } from "@supabase/supabase-js";

import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const downloadImage = (_id: string, photo: string) => {
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
};

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_DB_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const createOrGetUser = async (response: any) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  const decoded = jwtDecode(response.credential);

  console.log("decodeddecode", JSON.stringify(decoded, null, 2));

  //TODO: verirfy we need  'addUser' function

  // const { name, picture, sub } = decoded;

  // addUser({ _type: "user", _id: sub, fullName: name, image: picture });
};

const signUpUser = async ({ email, password, name }) => {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  const { error: registerUserError } = await supabase.from("profiles").insert([
    {
      name: name,
      user_id: signUpData?.user?.id,
      email: signUpData?.user?.email,
    },
  ]);
  return { data: null, error: signUpError || registerUserError };
};

const signInUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

const getDateFromNow = (referenceDate: string) => {
  return dayjs(referenceDate).fromNow(true);
};
const getFormatedDate = (referenceDate: string, format: string) => {
  return dayjs(referenceDate).format(format);
};

const getShortenedDateFromNow = (referenceDate: string) => {
  const [number, time] = dayjs(referenceDate).fromNow(true).split(" ");
  return `${number} ${time[0]}`;
};

function auto_grow(event: React.ChangeEvent<HTMLTextAreaElement>) {
  const element = document.getElementById(event.target.id);
  if (!element) return;

  const currentHeight = parseInt(element.style.height);
  if (isNaN(currentHeight) || currentHeight < 240) {
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }
}

export {
  auto_grow,
  signUpUser,
  signInUser,
  cn,
  downloadImage,
  createOrGetUser,
  getDateFromNow,
  getFormatedDate,
  getShortenedDateFromNow,
};
