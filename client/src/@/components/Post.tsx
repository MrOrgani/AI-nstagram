import React from "react";
import {
  IoHeartOutline,
  IoChatbubbleOutline,
  IoHappyOutline,
} from "react-icons/io5";

import { HiArrowDownTray } from "react-icons/hi2";
import { downloadImage } from "../lib/utils";

type User = {
  avatar: string;
  name: string;
};

export type PostType = {
  name: any;
  _id: string;
  prompt: string;
  photo: string;
  date: string;
  comments: number;
  likes: number;
  user: User;
};

const Post = ({ data }: { data: PostType }) => {
  // const { likePost, activeUser, unlikePost } = useAppContext();

  // const [contextMenuOpen, setContextMenuOpen] = useState<boolean>(false);

  return (
    <div className="border bg-white rounded-xl mb-4">
      {/* <PostCardContextMenu
        open={contextMenuOpen}
        setOpen={setContextMenuOpen}
      /> */}

      <div className="flex items-center justify-between p-2.5">
        <div className="flex items-center">
          {data.user?.avatar ? (
            <div className="h-10 w-10 bg-neutral-200 rounded-full">
              <img
                src={data.user?.avatar}
                alt={data.user?.name + "avatar"}
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-green-700 flex justify-center items-center text-white text-md font-bold">
              {data.name[0]}
            </div>
          )}
          <div className="ml-2.5">
            <p className="font-medium text-sm">
              {data.user?.name || data.name}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full bg-neutral-200">
        <img src={data.photo} alt="" className="w-full h-full" />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between text-2xl">
          <div className="flex items-center space-x-4">
            {/* {data.likedBy.includes(activeUser!) ? (
              <IoHeart
                className="cursor-pointer text-red-500 transition-all active:scale-75"
                onClick={() => unlikePost(data.id)}
              />
            ) : ( */}
            <IoHeartOutline
              className="cursor-pointer transition-all hover:opacity-50 active:scale-75"
              // onClick={() => likePost(data.id)}
            />
            {/* )} */}
            <IoChatbubbleOutline className="cursor-pointer hover:opacity-50" />
          </div>
          <HiArrowDownTray
            className="cursor-pointer hover:opacity-50"
            onClick={() => downloadImage(data._id, data.photo)}
          />
        </div>
        <div className="flex items-center my-3 space-x-2">
          {data.likes > 0 ? (
            <div className="my-2 text-sm">
              <span className="font-medium">{data.likes} likes</span>
            </div>
          ) : null}
        </div>
        <div className="text-sm my-2">
          <span className=" font-semibold inline-block mr-2">
            {data.user?.name || data.name}
          </span>
          <span>{data.prompt}</span>
        </div>
        {data.comments > 0 ? (
          <p className="text-neutral-500 font-medium text-sm my-2 cursor-pointer">
            View all {data.comments} comments
          </p>
        ) : null}
        <p
          className="my-2 text-neutral-400 text-sm uppercase"
          style={{ fontSize: 12 }}
        >
          {new Date(data.date).toDateString()}
        </p>
      </div>
      <div className="border-t p-3 text-sm flex items-center justify-between space-x-3">
        <IoHappyOutline className="text-2xl" />
        <input
          type="text"
          className="outline-none block flex-1"
          placeholder="Add a comment"
        />
        <div className="text-blue-400 font-bold mr-1 cursor-pointer">Post</div>
      </div>
    </div>
  );
};

export default Post;
