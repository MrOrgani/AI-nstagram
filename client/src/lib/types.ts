import { User } from "@supabase/supabase-js";

type ProfileType = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  user_id: string;
};

type Comment = {
  comment_id: string;
  created_at: string;
  user_id: string;
  text: string;
  post_id: number;
  user: ProfileType;
};
type PostType = {
  id: number;
  prompt: string;
  photo: string;
  created_at: string;
  comments: number;
  commentsByUser: Comment[];
  likes: number;
  user: ProfileType;
  likedByUser: Array<{ id: User["id"] }>;
};

export type { User, PostType, Comment, ProfileType };
