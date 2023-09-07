import React, { useEffect, useState } from "react";
import type { PostType } from "../@/components/Post";
import Loader from "../@/components/Loader";
import Post from "../@/components/Post";
import { getAllPeopleQuery } from "../@/lib/queries";
import request from "graphql-request";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState<PostType[]>([]);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      // const res = await fetch("https://van-gan.onrender.com/api/v1/post", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      const res = await request(
        "http://localhost:4000/graphql",
        getAllPeopleQuery
      );
      console.log("res", res);
      // const photos = (await res.json()) as { data: PostType[] };
      // setAllPosts(photos.data.reverse());
      setAllPosts((res as any).getAllPeople);
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
                <Post key={post._id} data={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
