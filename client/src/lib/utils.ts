import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import * as FileSaver from "file-saver";
import jwtDecode from "jwt-decode";
import { User, createClient } from "@supabase/supabase-js";

import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import supabase from "./supabase";
dayjs.extend(relativeTime);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const downloadImage = (_id: number, photo: string) => {
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
};

const updateUserProfile = async (user: User) => {
  const { error: registerUserError } = await supabase.from("profiles").insert([
    {
      name: user.user_metadata.full_name,
      user_id: user?.id,
      email: user?.email,
      avatar: user?.user_metadata?.avatar_url || null,
    },
  ]);
  if (registerUserError) {
    throw new Error(registerUserError.message);
  }
  return;
};

const createOrGetUser = async (response: any) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  const decoded: any = jwtDecode(response.credential);

  // const decodeded: {
  //   iss: "https://accounts.google.com";
  //   azp: "495858687863-8n5ktg0ehh2skj12kc2e977hqm7ejd3v.apps.googleusercontent.com";
  //   aud: "495858687863-8n5ktg0ehh2skj12kc2e977hqm7ejd3v.apps.googleusercontent.com";
  //   sub: "109142397529339876212";
  //   email: "maxime.organi@gmail.com";
  //   email_verified: true;
  //   nbf: 1698679900;
  //   name: "Maxime Organi";
  //   picture: "https://lh3.googleusercontent.com/a/ACg8ocL-YDfrUjlDgaeSLT2MwQ8a2SPMk1JStPfj0tJ_fVV3tfE=s96-c";
  //   given_name: "Maxime";
  //   family_name: "Organi";
  //   locale: "fr";
  //   iat: 1698680200;
  //   exp: 1698683800;
  //   jti: "8d644572414ce621e7fa6e6d7d9393b6090ede15";
  // };

  await updateUserProfile({
    id: "",
    user_metadata: {
      full_name: decoded?.given_name,
      avatar_url: decoded.picture,
    },
    email: decoded.email,
    app_metadata: { provider: "google" },
    created_at: "",
    aud: decoded?.aud,
  });
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

  if (isNaN(currentHeight) || currentHeight < 140) {
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }
}

const stringToColour = (str: string) => {
  if (!str) return "";
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

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: "image/jpeg" });
}

export {
  auto_grow,
  cn,
  downloadImage,
  createOrGetUser,
  getDateFromNow,
  getFormatedDate,
  getShortenedDateFromNow,
  stringToColour,
  getContrastingColor,
  dataUrlToFile,
  updateUserProfile,
};
