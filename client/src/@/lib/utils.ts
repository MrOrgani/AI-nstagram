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

const createOrGetUser = async (response: any, addUser: any) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  const decoded = jwtDecode(response.credential);

  console.log("decodeddecode", JSON.stringify(decoded, null, 2));

  const { name, picture, sub } = decoded;

  addUser({ _type: "user", _id: sub, fullName: name, image: picture });
};

const signUpUser = async ({ email, password, name }, addUser) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    console.log("Client res signUpUser", data, error);

    const res = await supabase
      .from("users")
      .insert([
        {
          fullname: name,
          email: email,
          password: password,
        },
      ])
      .select();
    return res;
  } catch (err) {
    console.log(err);
  }
};

const signInUser = async ({ email, password }, addUser) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("Client res signInUser", data, error);
  } catch (err) {
    console.log(err);
  }
};

const getDateFromNow = (referenceDate: string) => {
  return dayjs(referenceDate).fromNow();
};

export {
  signUpUser,
  signInUser,
  cn,
  downloadImage,
  createOrGetUser,
  getDateFromNow,
};
