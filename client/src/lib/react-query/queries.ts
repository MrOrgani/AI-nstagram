import {
  useMutation,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createUserAccount,
  fetchFeedPosts,
  getUserById,
  publishPost,
  signInAccount,
  signOut,
  updateUser,
} from "@/lib/supabase/api";
import { INewPost, INewUser, IUpdateUser, PostType } from "../types";

///////////////////////////////////////////////////////
// Posts
///////////////////////////////////////////////////////
export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: ["feed-posts"],

    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetchFeedPosts(pageParam);
      return res;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextId ?? undefined;
    },
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPost: INewPost) => publishPost(newPost),
    onSuccess: (data: PostType) => {
      queryClient.invalidateQueries({
        queryKey: ["feed-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", data.user_id],
      });
    },
  });
};

///////////////////////////////////////////////////////
// Users
///////////////////////////////////////////////////////

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useGetCurrentUser = (userId: string) => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => getUserById(userId),
  });
};
export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: Pick<INewUser, "email" | "password">) =>
      signInAccount(user),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserById(userId),
  });
};

export const useSignOut = () => {
  return useMutation({
    mutationFn: () => signOut(),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (userInfo) => {
      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", userInfo.id],
      });
    },
  });
};
