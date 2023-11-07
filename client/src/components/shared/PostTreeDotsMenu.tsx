import { downloadImage } from "@/lib/utils";
import { usePostContext } from "@/context/PostContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Download, Trash2 } from "lucide-react";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePost } from "@/lib/react-query/queries";

export const PostTreeDotsMenu = () => {
  const { user } = useUserContext();
  const { currentPost } = usePostContext();

  const { mutate: deletePost } = useDeletePost();

  const isCurrentUserAuthor = currentPost?.user.id === user?.id;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer hover:opacity-50"
            onClick={() =>
              downloadImage(`${currentPost.id}`, currentPost.photo)
            }>
            <Download className="mr-2 h-4 w-4" />
            <span>Download</span>
          </DropdownMenuItem>
          {isCurrentUserAuthor ? (
            <DropdownMenuItem
              className="cursor-pointer hover:opacity-50"
              onClick={() =>
                deletePost({ postId: currentPost.id, userId: user?.id })
              }>
              <Trash2 className={`"mr-2 h-4 w-4"`} />
              <span>Delete</span>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
