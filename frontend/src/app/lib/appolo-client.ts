import { ApolloClient, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    uri: "https://api.studio.thegraph.com/query/94906/iamuse/version/latest",
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;