const { gql } = require('apollo-server');

module.exports = gql`
  # scalar type
  scalar DateTime
  type Auth {
    id: ID
    email: String!
    token: String!
    points: Int!
    attempts: Int!
    coupons: [String]
  }
  type User {
    id: ID
    email: String
    password: String
    dob: DateTime
    active: Boolean
    attempts: Int
    points: Int
    coupons: [String]
  }

  type VerifyToken {
    id: ID!
    email: String!
    token: String!
  }

  # input type
  input RegistrationInput {
    email: String!
    password: String!
    dob: DateTime!
  }

  input LoginInput {
    email: String!
    password: String!
  }


  type Query {
    getCurrentUser: Auth!
    verifyToken: VerifyToken!
  }
  
  type Mutation {
    register(input: RegistrationInput): Auth
    login(input: LoginInput): Auth
    updatePoints(points: Int!): Auth!
  }
`;