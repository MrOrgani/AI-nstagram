import supabase from "@/lib/supabase";
import { INewPost, INewUser, IUpdateUser, IUser, PostType } from "../types";
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

export const publishPost = async (newPost: INewPost) => {
  const fileName = `${newPost.authorId}_${Date.now()}`;
  const fileImage = await dataUrlToFile(newPost.photo, fileName);

  const { data: uploadData, error: errorUpload } = await supabase.storage
    .from("ai-stagram-bucket")
    .upload(fileName, fileImage);

  if (errorUpload) {
    throw new Error(errorUpload.message);
  }

  const { data: postData, error } = await supabase
    .from("posts")
    .insert([
      {
        prompt: newPost.prompt,
        user_id: newPost.authorId,
        photo: uploadData.path,
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

  // debugger;

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

  const { data: updatedPost, error: updatedDislikedPost } = await supabase
    .from("posts")
    .update({ likes: Math.max(0, parseInt(currentPostLikes?.[0].likes) - 1) })
    .eq("id", postId)
    .select();

  if (updatedDislikedPost) {
    throw new Error(updatedDislikedPost.message);
  }

  return updatedPost[0];
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
    id:user_id, 
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
