import supabase from "../../../supabase";
import { PostType } from "../types";

export const PAGE_COUNT = 2;

const fetchFeedPosts = async (offset: number) => {
  const from = offset * PAGE_COUNT;
  const to = from + PAGE_COUNT - 1;

  const { data } = await supabase
    .from("posts")
    .select(
      `*,
      user:user_id (*,id:user_id),
      likedByUser:likes(id:user_id)
      `
    )
    .range(from, to)
    .order("created_at", { ascending: false })
    .limit(PAGE_COUNT);

  return { data: data ?? [] };
};

const getPostsByUserId = async (userId: string) => {
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `*,
    user:user_id (*),
    likedByUser:likes(id:user_id)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<PostType[]>();

  if (error) {
    throw new Error(error.message);
  }
  return posts;
};

const getCommentsFromPostId = async (postId: number) => {
  const { data: comments, error } = await supabase.functions.invoke(
    "getPostComments",
    {
      body: JSON.stringify({
        post_id: postId,
      }),
    }
  );
  if (error) {
    throw new Error(error.message);
  }
  return comments;
};

export { getPostsByUserId, getCommentsFromPostId, fetchFeedPosts };
