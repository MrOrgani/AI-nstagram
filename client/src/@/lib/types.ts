type User = {
  id: number;
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
  likes: number;
  user: User;
  likedByUser: User[];
};

export type { User, PostType };
