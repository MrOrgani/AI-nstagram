import { gql } from "graphql-request";

const generateImgQuery = gql`
  query ($prompt: String) {
    generateImg(prompt: $prompt)
  }
`;

export { generateImgQuery };
