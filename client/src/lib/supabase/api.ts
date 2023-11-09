import supabase from "@/lib/supabase";
import {
  INewComment,
  INewPost,
  INewUser,
  IUpdateUser,
  IUser,
  PostType,
} from "../types";
import { dataUrlToFile } from "../utils";

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

export const getPostById = async (postId: number): Promise<PostType> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        *,
        user:user_id (
          *,
          id:user_id
          ),
        likedByUser:likes(
          id:user_id
          )
    `
    )
    .eq("id", postId);
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
};

export const getImgFromStorage = async (imgPath: string) => {
  const { data } = await supabase.storage
    .from("ai-stagram-bucket")
    .getPublicUrl(imgPath);

  return data.publicUrl;
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
  const { data, error } = await supabase
    .from("comments")
    .select(
      `*,
      user:user_id(
        *,
        id:user_id
      )
    `
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const publishPost = async (newPost: INewPost) => {
  const fileName = `${newPost.authorId}_${Date.now()}`;
  const fileImage = await dataUrlToFile(newPost.b64_json, fileName);

  const { data: uploadData, error: errorUpload } = await supabase.storage
    .from("ai-stagram-bucket")
    .upload(`/${newPost.authorId}/${fileName}`, fileImage, {
      contentType: "image/*",
    });

  if (errorUpload) {
    throw new Error(errorUpload.message);
  }

  const { data } = await supabase.storage
    .from("ai-stagram-bucket")
    .getPublicUrl(uploadData.path);

  const { data: postData, error } = await supabase
    .from("posts")
    .insert([
      {
        prompt: newPost.prompt,
        user_id: newPost.authorId,
        photo: data.publicUrl,
      },
    ])
    .select("*");
  if (error) {
    throw new Error(error.message);
  }
  return postData[0];
};

export const likePost = async ({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) => {
  // We verify if the user already liked the post
  const { data: alreadyExistingLike } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (alreadyExistingLike && alreadyExistingLike.length > 0) {
    throw new Error("You already liked this post");
  }

  // We add the new likes to the table
  const { error: addedLikeError } = await supabase.from("likes").insert([
    {
      post_id: postId,
      user_id: userId,
    },
  ]);

  if (addedLikeError) {
    throw new Error(addedLikeError.message);
  }

  // We get the current likes of the liked post and increment it by one
  const { data: currentPostLikes, error: getLikedPostError } = await supabase
    .from("posts")
    .select("likes")
    .eq("id", postId);
  if (getLikedPostError) {
    throw new Error(getLikedPostError.message);
  }

  const { data: updatedPost, error: updatedLikedPost } = await supabase
    .from("posts")
    .update({ likes: parseInt(currentPostLikes?.[0].likes) + 1 })
    .eq("id", postId)
    .select();

  if (updatedLikedPost) {
    throw new Error(updatedLikedPost.message);
  }

  return updatedPost[0];
};
export const dislikePost = async ({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) => {
  await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);

  // We get the current likes of the liked post and decrement it by one
  const { data: currentPostLikes } = await supabase
    .from("posts")
    .select("likes")
    .eq("id", postId);

  const { data: updatedPost, error: updatedPostError } = await supabase
    .from("posts")
    .update({ likes: Math.max(0, parseInt(currentPostLikes?.[0].likes) - 1) })
    .eq("id", postId)
    .select();

  if (updatedPostError) {
    throw new Error(updatedPostError.message);
  }

  return updatedPost[0];
};

export const commentPost = async ({ postId, userId, text }: INewComment) => {
  const { error: addedCommentError } = await supabase.from("comments").insert([
    {
      post_id: postId,
      user_id: userId,
      text,
    },
  ]);

  if (addedCommentError) {
    throw new Error(addedCommentError.message);
  }

  const { data: currentPostComments } = await supabase
    .from("posts")
    .select("comments")
    .eq("id", postId);

  const { data: updatedPost, error: updatedPostError } = await supabase
    .from("posts")
    .update({ comments: parseInt(currentPostComments?.[0].comments) + 1 })
    .eq("id", postId)
    .select();

  if (updatedPostError) {
    throw new Error(updatedPostError.message);
  }

  return updatedPost[0];
};

export const deleteComment = async ({
  commentId,
  postId,
  userId,
}: {
  commentId: string;
  postId: number;
  userId: string;
}) => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .eq("post_id", postId);

  if (error) {
    throw new Error(error.message);
  }

  const { data: currentPostComments } = await supabase
    .from("posts")
    .select("comments")
    .eq("id", postId);

  const { data: updatedPost, error: updatedPostError } = await supabase
    .from("posts")
    .update({ comments: parseInt(currentPostComments?.[0].comments) - 1 })
    .eq("id", postId)
    .select();

  if (updatedPostError) {
    throw new Error(updatedPostError.message);
  }
  return updatedPost[0];
};

export const deletePost = async ({
  postId,
  userId,
}: {
  postId: number;
  userId: string;
}) => {
  const { data: deletedPost, error } = await supabase
    .from("posts")
    .delete()
    .eq("user_id", userId)
    .eq("id", postId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return deletedPost[0];
};

////////////////////////////////////////////////////////////////////////
//  USER
////////////////////////////////////////////////////////////////////////

export const getCurrentUser = async () => {
  // const { data } = await supabase.auth.getUser();
  const { data } = await supabase.auth.getSession();
  return data.session;
};
export const getUserById = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
    *,
    id:user_id, 
    posts(
      *,
      likedByUser:likes(id:user_id))
    `
    )
    .eq("user_id", userId)
    .returns<Array<IUser & { posts: PostType[] }>>();

  if (error) {
    throw new Error(error.message);
  }

  return profile.length ? profile[0] : null;
};

export const signInAccount = async (
  user: Pick<INewUser, "email" | "password">
) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });

  return { data, error };
};

export const addUserToDB = async (user: {
  name: string;
  id: string;
  email: string;
  avatar: string;
}) => {
  const { data: registeredUser, error: registerUserError } = await supabase
    .from("profiles")
    .insert([
      {
        name: user.name,
        user_id: user?.id,
        email: user?.email,
        avatar: user?.avatar || null,
      },
    ])
    .select(
      `*,
      id:user_id
    `
    );

  if (registerUserError) {
    throw new Error(registerUserError.message);
  }

  return registeredUser[0];
};

export const createUserAccount = async (user: INewUser) => {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const registeredUser = addUserToDB({
    name: user.name,
    id: data?.user?.id || "",
    email: data?.user?.email || "",
    avatar: "",
  });

  return registeredUser;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error.message);
  }
  return;
};

const deleteCurrentAvatar = async (avatarId: string) => {
  const { error: errorDelete } = await supabase.storage
    .from("ai-stagram-bucket")
    .remove([avatarId]);

  if (errorDelete) {
    throw new Error(errorDelete.message);
  }
};

const uploadNewAvatar = async ({
  file,
  fileName,
}: {
  file: File;
  fileName: string;
}) => {
  const { data: avatarData, error: errorUpload } = await supabase.storage
    .from("ai-stagram-bucket")
    .upload(`/avatar/${fileName}`, file, {
      upsert: true,
    });
  if (errorUpload) {
    throw new Error(errorUpload.message);
  }

  const { data } = await supabase.storage
    .from("ai-stagram-bucket")
    .getPublicUrl(avatarData?.path);

  return data.publicUrl;
};

export const updateUser = async (userInfo: IUpdateUser) => {
  let avatarPath = "";

  // if New avatar is present, upload it and delete the old one
  if (userInfo.newAvatar) {
    const fileName = `${userInfo?.id}_${Date.now()}`;

    const newAvatarPath = await uploadNewAvatar({
      file: userInfo.newAvatar,
      fileName,
    });
    avatarPath = newAvatarPath;
  }

  // if old avatar is present, delete it
  if (userInfo.currentAvatarName) {
    await deleteCurrentAvatar(userInfo.currentAvatarName);
  }

  // update user profile
  const dataToUpdate = {
    ...(avatarPath && { avatar: avatarPath }),
    name: userInfo.username, // TODO: change to username
  };

  const { data, error } = await supabase
    .from("profiles")
    .update(dataToUpdate)
    .eq("user_id", userInfo?.id)
    .select(
      `
      *,
      id:user_id, 
      posts(*,likedByUser:likes(id:user_id))
      `
    );

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};
