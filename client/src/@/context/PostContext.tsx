import { createContext, useContext, useState } from "react";

const PostContext = createContext({});

export const PostProvider = ({ post, children }) => {
  const [currentPost, setCurrentPost] = useState(post);

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
