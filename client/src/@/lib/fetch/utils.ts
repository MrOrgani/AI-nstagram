import supabase from "../../../supabase";
import { PostType } from "../types";

const getPostsByUserId = async (userId: string) => {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
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

export { getPostsByUserId, getCommentsFromPostId };
