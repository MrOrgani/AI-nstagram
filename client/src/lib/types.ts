import { User } from "@supabase/supabase-js";

export type IUser = {
  id: string;
  name: string;
  avatar: string;
  email: string;
};

export type Comment = {
  comment_id: string;
  created_at: string;
  user_id: string;
  text: string;
  post_id: number;
  user: IUser;
};
export type PostType = {
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

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};
