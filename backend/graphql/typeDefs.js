const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Project {
    id: ID!
    name: String!
    description: String
    category: String!
    dueDate: String
    attachments: [Attachment]
  }

  type Attachment {
    fileName: String!
    fileId: String!
  }

  type Query {
    users: [User]
    projects: [Project]
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User
    createProject(name: String!, description: String, category: String!, dueDate: String): Project
  }
`;

module.exports = typeDefs;
