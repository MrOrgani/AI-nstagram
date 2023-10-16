import supabase from "../../../supabase";
import { PostType } from "../types";

const getPostsByUserId = async (userId: string) => {
  try {
    const { data: posts } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .returns<PostType[]>();
    return posts;
  } catch (error) {
    console.log(error);
  }
};

const getCommentsFromPostId = async (postId: number) => {
  try {
    const { data: comments, error } = await supabase.functions.invoke(
      "getPostComments",
      {
        body: JSON.stringify({
          post_id: postId,
        }),
      }
    );
    return comments;
  } catch (error) {
    console.log(error);
  }
};

export { getPostsByUserId, getCommentsFromPostId };
