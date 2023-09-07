import { gql } from "graphql-request";
//create our query
const getAllPeopleQuery = gql`
  query {
    getAllPeople {
      #run the getAllPeople command
      id
      name
    }
  }
`;
const generateImgQuery = gql`
  query ($prompt: String) {
    generateImg(prompt: $prompt)
  }
`;

export { getAllPeopleQuery, generateImgQuery };
