import {
  // useQuery,
  useMutation,
  // useQueryClient,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  createUserAccount,
  fetchFeedPosts,
  getUserById,
  signInAccount,
  signOut,
} from "@/lib/supabase/api";
import { INewUser } from "../types";

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

///////////////////////////////////////////////////////
// Users
///////////////////////////////////////////////////////

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
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
