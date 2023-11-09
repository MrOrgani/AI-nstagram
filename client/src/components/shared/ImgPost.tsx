import type { PostType } from "@/lib/types";

export const ImgPost = (post: PostType) => {
  return (
    <img
      src={post.photo}
      alt={post.prompt}
      className="h-full w-full"
      loading="lazy"
    />
  );
};
