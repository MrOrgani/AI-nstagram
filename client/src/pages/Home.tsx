import React, { useEffect, useState } from "react";
import Loader from "../@/components/Loader";
import Post from "../@/components/Post";
import supabase from "../supabase";

import type { PostType } from "../@/lib/types";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState<PostType[]>([]);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const { data } = await supabase.functions.invoke("getPosts");
      setAllPosts(data.data ?? []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPosts();
  }, []);
  return (
    <main className="py-6 px-4 mx-auto w-[560px]">
      <div className="col-span-7 mt-20">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            <div className="">
              {allPosts.map((post) => (
                <Post key={`post-${post.id}`} currentPost={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
