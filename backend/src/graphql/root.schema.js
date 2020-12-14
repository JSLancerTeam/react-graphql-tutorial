import Apollo from 'apollo-server-express';

const { gql } = Apollo;
const rootSchema = gql`
  scalar Date

  type LoginResponse {
    token: String!
    user: User
  }

  type User {
    id: ID!
    username: String!
    email: String!
    favorites: [String!]
    isActive: Boolean
  }

  type Event {
    id: ID!
    name: String!
    type: String!
    message: String!
    createdAt: Date
  }

  type Query {
    events(type: String!): [Event]
  }

  type Mutation {
    login(username: String!, password: String!): LoginResponse
  }
`;

export default rootSchema;
