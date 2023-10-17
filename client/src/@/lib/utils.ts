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

const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
};

const getContrastingColor = (color: string) => {
  // Remove the '#' character if it exists
  const hex = color.replace("#", "");

  // Convert the hex string to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white depending on the brightness
  return brightness > 128 ? "black" : "white";
};

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
  stringToColour,
  getContrastingColor,
};
