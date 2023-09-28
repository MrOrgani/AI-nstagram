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
  const { error: signUpError } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  const { data, error: registerUserError } = await supabase
    .from("profiles")
    .insert([
      {
        name,
        email: email,
        password: password,
      },
    ]);
  return { data, error: signUpError || registerUserError };
};

const signInUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

const getDateFromNow = (referenceDate: string) => {
  return dayjs(referenceDate).fromNow();
};

function auto_grow(event: { target: { id: string } }) {
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
};
