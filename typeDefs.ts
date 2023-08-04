const {gql} = require('apollo-server-express')

export const typeDefs = gql`

    type Account {
        id: ID,
        code: String,
        auxiliary: String,
        name: String,
        parent_id: ID,
        class: String,
        level: Int,
        currency: String,
        by_document: Boolean,
        by_cost: Boolean,
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
