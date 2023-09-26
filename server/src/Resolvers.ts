import * as dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

import people from "./dataset"; //get all of the available data from our database.
import { scryptSync } from "node:crypto";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
if (!process.env.SUPABASE_DB_URL || !process.env.SUPABASE_KEY) {
  throw new Error("Supabase url or supabase key is missing");
}

const supabase = createClient(
  process.env.SUPABASE_DB_URL,
  process.env.SUPABASE_KEY
);

const Resolvers = {
  Query: {
    getUser: async (_: any, args: any) => {
      const user = await supabase.from("users").select();
      // .eq("user_id", args.userID);

      console.log("res getUser", user, args);
    },
    //if the user runs the getPerson command:
    getAllPostsQuery: async (_: any, args: any) => {
      const posts = await supabase.from("posts").select();
      console.log("getAllPostsQuery posts", posts);
      return posts.data;
    },
    generateImg: async (_: any, args: any, test: any) => {
      try {
        const { prompt } = args;

        const aiResponse = await openai.images.generate({
          prompt,
          n: 1,
          size: "1024x1024",
          response_format: "b64_json",
        });

        const photo = aiResponse.data["0"].b64_json;

        return photo;
      } catch (err) {
        console.log(err);
      }
    },
  },
  Mutation: {
    signUpUser: async (_: any, args: any) => {
      const hashedPassword = scryptSync(args?.password, "test", 64).toString(
        "hex"
      );

      const { data, error } = await supabase.auth.signUp({
        email: args.email,
        // password: hashedPassword,
        password: args.password,
      });

      console.log("res signUpUser", args, data, error, hashedPassword);

      const res = await supabase
        .from("users")
        .insert({
          fullname: args?.name,
          email: args?.email,
          password: hashedPassword,
        })
        .select();
      console.log("res signUpUser", res);
      return res;
    },
  },
};
export default Resolvers;
