import { createContext, useContext, useState } from "react";
import { PostType } from "../lib/types";

export const PostContext = createContext<{
  currentPost: PostType;
  update: React.Dispatch<React.SetStateAction<PostType>>;
}>({ currentPost: {} as PostType, update: () => null });

import { ReactNode } from "react";

interface PostProviderProps {
  post: PostType;
  children: ReactNode;
}

export const PostProvider = ({ post, children }: PostProviderProps) => {
  const [currentPost, setCurrentPost] = useState<PostType>(post);

  return (
    <PostContext.Provider value={{ currentPost, update: setCurrentPost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const { currentPost, update } = useContext(PostContext);
  return { currentPost, update };
};
