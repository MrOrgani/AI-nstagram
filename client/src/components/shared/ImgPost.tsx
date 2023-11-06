import type { PostType } from "@/lib/types";
import supabase from "@/lib/supabase";

export const ImgPost = (post: PostType) => {
  return (
    <img
      src={
        supabase.storage.from("ai-stagram-bucket").getPublicUrl(post.photo).data
          .publicUrl
      }
      alt={post.prompt}
      className="w-full h-full"
      loading="lazy"
    />
  );
};
