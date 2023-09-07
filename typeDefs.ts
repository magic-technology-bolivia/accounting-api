const {gql} = require('apollo-server-express')

export const typeDefs = gql`
    type Code{
        element: String,
        group: String,
        account: String,
        subaccount: String,
        auxiliary: String,
    }
    type User{
        _id: ID,
        username: String,
        firstname: String,
        lastname: String,
    }
    type Account {
        _id: ID        
        name: String,        
        parent_id: ID,
        author_id: ID,
        code: Code,
        friendly_code: String,
        class: String,
        level: Int,
        currency: String,
        by_document: Int,
        by_cost: Int
        author: User
    }

    type Query {
        hello:String,
        getAllAccounts: [Account],
        getAccount(id:ID): Account
    }

    input CodeInput{
        element: String,
        group: String,
        account: String,
        subaccount: String,
        auxiliary: String,
    }

    input AccountInput{        
        name: String,        
        parent_id: ID,
        author_id: ID,
        code: CodeInput,
        class: String,
        level: Int,
        currency: String,
        by_document: Int,
        by_cost: Int,
    }

    input AccountCode{
        element: String,
        group: String,
        account: String,
        subaccount: String,
        auxiliary: String,
    }

    type Mutation {
        createAccount(name: String!, parent_id: String, author_id: String, level: String, code: AccountCode): Account,
        deleteAccount(_id: ID!): String,
        updateAccount(_id: ID!, account: AccountInput): Account,
    }
`
