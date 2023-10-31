import { usePostContext } from "@/context/PostContext";

const NumberOfLikesDisplay = () => {
  const { currentPost } = usePostContext();

  if (!currentPost?.likes || currentPost?.likes < 1) {
    return null;
  }

  return (
    <section className="mb-2">
      <div className="text-sm">
        <span className="font-medium">{currentPost.likes} likes</span>
      </div>
    </section>
  );
};

export default NumberOfLikesDisplay;
