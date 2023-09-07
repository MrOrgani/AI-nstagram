import { gql } from "graphql-request";

const addPersonMutation = gql`
  mutation addPeople($name: String!) {
    addPerson(name: $name) {
      #add a new entry. Argument will be 'name'
      id
      name
    }
  }
`;

export { addPersonMutation };
