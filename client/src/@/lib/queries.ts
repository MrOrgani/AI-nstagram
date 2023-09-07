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

export { getAllPeopleQuery };
