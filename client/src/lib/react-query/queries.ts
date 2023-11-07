import {
  useMutation,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  commentPost,
  createUserAccount,
  deleteComment,
  deletePost,
  dislikePost,
  fetchFeedPosts,
  getCommentsFromPostId,
  getPostById,
  getUserById,
  likePost,
  publishPost,
  signInAccount,
  signOut,
  updateUser,
} from "@/lib/supabase/api";
import {
  INewComment,
  INewPost,
  INewUser,
  IUpdateUser,
  PostType,
} from "../types";

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
export const useGetPostById = (postId: number) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
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

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: { postId: number; userId: string }) => likePost(props),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["feed-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", data.id],
      });
    },
  });
};

export const useDislikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: { postId: number; userId: string }) =>
      dislikePost(props),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["feed-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", data.id],
      });
    },
  });
};

export const useGetCommentsFromPostId = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsFromPostId(postId),
  });
};
export const useCommentPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: INewComment) => commentPost(props),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["feed-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", data.id],
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: {
      commentId: string;
      postId: number;
      userId: string;
    }) => deleteComment(props),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["feed-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", data.id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: { postId: number; userId: string }) =>
      deletePost(props),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["feed-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", data.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", data.id],
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
