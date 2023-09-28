type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
};
type PostType = {
  id: string;
  prompt: string;
  photo: string;
  created_at: string;
  comments: number;
  commentsByUser: Array<{ id: User["id"] }>;
  likes: number;
  user: User;
  likedByUser: Array<{ id: User["id"] }>;
};

export type { User, PostType };
