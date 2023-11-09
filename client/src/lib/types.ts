import { User } from "@supabase/supabase-js";

export type IUser = {
  id: string;
  name: string;
  avatar: string;
  email: string;
};

export type IComment = {
  comment_id: string;
  created_at: string;
  user_id: string;
  text: string;
  post_id: number;
  user: IUser;
};
export type PostType = {
  user_id: string;
  id: number;
  prompt: string;
  photo: string;
  created_at: string;
  comments: number;
  commentsByUser: Comment[];
  likes: number;
  user: IUser;
  likedByUser: Array<{ id: User["id"] }>;
};

export type GenerateImg = {
  b64_json: string;
  revised_prompt: string;
};

export type INewPost = {
  prompt: string;
  authorId: string;
  b64_json: string;
};

export type INewComment = {
  postId: number;
  userId: string;
  text: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IUpdateUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  // password: string;
  currentAvatarName: string;
  newAvatar: File | undefined;
};
