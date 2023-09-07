import * as dotenv from "dotenv";
import OpenAI from "openai";

import people from "./dataset"; //get all of the available data from our database.

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const Resolvers = {
  Query: {
    getAllPeople: () => people, //if the user runs the getAllPeople command
    //if the user runs the getPerson command:
    getPerson: (_: any, args: any) => {
      console.log(args);
      return people.find((person) => person.id === args.id);
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
    //create our mutation:
    addPerson: (_: any, args: any) => {
      const newPerson = {
        id: people.length + 1, //id field
        name: args.name, //name field
      };
      people.push(newPerson);
      return newPerson; //return the new object's result
    },
  },
};
export default Resolvers;
