import { LikeIcon } from "./LikeIcon";
import { PostTreeDotsMenu } from "./PostTreeDotsMenu";
import { MessageCircle } from "lucide-react";

interface Props {
  handleIconClick: () => void;
}
export const PostIconsHeader = ({ handleIconClick }: Props) => {
  return (
    <div className="flex items-center justify-between text-2xl mt-1 mb-[6px]">
      <div className="flex items-center">
        <span className="block">
          <LikeIcon />
        </span>
        <div className="block">
          <div className="p-2">
            <MessageCircle
              className="cursor-pointer hover:opacity-50 "
              onClick={handleIconClick}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <PostTreeDotsMenu />
      </div>
    </div>
  );
};
