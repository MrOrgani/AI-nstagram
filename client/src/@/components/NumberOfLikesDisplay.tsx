import { usePostContext } from "../context/PostContext";

const NumberOfLikesDisplay = () => {
  const { currentPost } = usePostContext();

  if (!currentPost?.likes || currentPost?.likes < 1) {
    return null;
  }

  return (
    <div className="my-2 text-sm">
      <span className="font-medium">{currentPost.likes} likes</span>
    </div>
  );
};

export default NumberOfLikesDisplay;
