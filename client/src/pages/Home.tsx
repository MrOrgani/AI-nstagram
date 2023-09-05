import React, { useEffect, useState } from "react";
import type { PostType } from "../components/Post";
import Loader from "../components/Loader";
import Post from "../components/Post";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState<PostType[]>([]);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://van-gan.onrender.com/api/v1/post", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const photos = (await res.json()) as { data: PostType[] };
      setAllPosts(photos.data.reverse());
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
    <main className="py-6 px-4 mx-auto" style={{ maxWidth: 840 }}>
      {/* <div className="grid grid-cols-12 gap-10"> */}
      <div className="col-span-7">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            <div className="">
              {allPosts.map((post) => (
                <Post key={post._id} data={post} />
              ))}
            </div>
          </>
        )}
        {/* </div> */}
      </div>
    </main>
  );
};

export default Home;
