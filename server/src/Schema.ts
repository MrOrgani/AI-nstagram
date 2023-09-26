import { gql } from "apollo-server-express"; //will create a schema

const Schema = gql`
  type User {
    id: String
    userID: String
    name: String
    imageUrl: String
    email: String
  }
  type PostType {
    id: String
    prompt: String
    photo: String
    date: String
    comments: Int
    likes: Int
    user: User
  }
  #handle user commands
  type Query {
    getUser(userID: String): User #will return multiple Person instances
    getAllPostsQuery: [PostType]
    generateImg(prompt: String): String #Request DALL-E to generate an img
  }

  type Mutation {
    #the addPerson commmand will accept an argument of type String.
    #it will return a 'User' instance.
    signUpUser(name: String, email: String, password: String): User
    publishPost(prompt: String, photo: String, userID: String): PostType
  }
`;
export default Schema;
