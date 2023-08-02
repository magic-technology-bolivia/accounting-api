const {gql} = require('apollo-server-express')

export const typeDefs = gql`

    type Account {
        id: ID
        name: String,
        description: String
    }

    type Query {
        hello:String,
        getAllAccounts: [Account],
        getAccount(id:ID): Account
    }

    input AccountInput{
        name: String
        description: String        
    }

    type Mutation {
        createAccount(name: String, description: String): Account,
        deleteAccount(id: ID!): String,
        updateAccount(id: ID!, account: AccountInput): Account,
    }
`
