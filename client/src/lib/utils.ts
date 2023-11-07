import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import * as FileSaver from "file-saver";

import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import supabase from "./supabase";
dayjs.extend(relativeTime);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const downloadImage = async (_id: string, photo: string) => {
  const { data, error } = await supabase.storage
    .from("ai-stagram-bucket")
    .download(photo);

  if (error) {
    throw error;
  }

  FileSaver.saveAs(data, `${photo}.jpg`);
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
  getDateFromNow,
  getFormatedDate,
  getShortenedDateFromNow,
  stringToColour,
  getContrastingColor,
  dataUrlToFile,
};
