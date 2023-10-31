import supabase from "@/lib/supabase";
import { INewUser, IUser, PostType } from "../types";

export const PAGE_COUNT = 2;

////////////////////////////////////////////////////////////////////////
//  POSTS
////////////////////////////////////////////////////////////////////////

export const fetchFeedPosts = async (
  offset: number
): Promise<{ data: PostType[]; nextId?: number }> => {
  const from = offset * PAGE_COUNT;
  const to = from + PAGE_COUNT - 1;

  const { data, error } = await supabase
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

  if (error) {
    throw new Error(error.message);
  }

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: data ?? [],
          nextId: data?.length > 0 ? offset + 1 : undefined,
        }),
      1000
    )
  );
};

export const getPostsByUserId = async (userId: string) => {
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

export const getCommentsFromPostId = async (postId: number) => {
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

////////////////////////////////////////////////////////////////////////
//  USER
////////////////////////////////////////////////////////////////////////

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.log(error.message);
    return;
  }
  return data.user;
};
export const getUserById = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
    *, 
    posts(*,likedByUser:likes(id:user_id))
    `
    )
    .eq("user_id", userId)
    .single<IUser & { posts: PostType[] }>();

  if (error) {
    throw new Error(error.message);
  }
  return profile;
};

export const signInAccount = async (
  user: Pick<INewUser, "email" | "password">
) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createUserAccount = async (user: INewUser) => {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // debugger;

  const { data: registeredUser, error: registerUserError } = await supabase
    .from("profiles")
    .insert([
      {
        name: user.name,
        user_id: data?.user?.id,
        email: data?.user?.email,
        avatar: data?.user_metadata?.avatar_url || null,
      },
    ])
    .select();

  if (registerUserError) {
    console.log(registerUserError.message);
    return;
  }
  return registeredUser[0];
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error.message);
  }
  return;
};
