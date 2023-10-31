import { IoChatbubbleOutline } from "react-icons/io5";
import { HiArrowDownTray } from "react-icons/hi2";
import { downloadImage } from "@/lib/utils";
import type { PostType } from "@/lib/types";
import LikeIcon from "./LikeIcon";
import { usePostContext } from "@/context/PostContext";

interface Props {
  handleIconClick: () => void;
  currentPost: PostType;
}
export const PostIconsHeader = ({ handleIconClick }: Props) => {
  const { currentPost } = usePostContext();
  return (
    <div className="flex items-center justify-between text-2xl mt-1 mb-[6px]">
      <div className="flex items-center">
        <span className="block">
          <LikeIcon />
        </span>
        <div className="block">
          <div className="p-2">
            <IoChatbubbleOutline
              className="cursor-pointer hover:opacity-50 "
              onClick={handleIconClick}
            />
          </div>
        </div>
      </div>
      <HiArrowDownTray
        className="cursor-pointer hover:opacity-50"
        onClick={() => downloadImage(currentPost.id, currentPost.photo)}
      />
    </div>
  );
};
