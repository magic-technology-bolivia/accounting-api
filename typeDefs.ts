const {gql} = require('apollo-server-express')

export const typeDefs = gql`

    type Code{
        element: String,
        group: String,
        account: String,
        subaccount: String,
        auxiliary: String,
    }
    type Account {
        id: ID        
        name: String,        
        parent_id: ID,
        code: Code,
        class: String,
        level: Int,
        currency: String,
        by_document: Int,
        by_cost: Int,
    }

    type Query {
        hello:String,
        getAllAccounts: [Account],
        getAccount(id:ID): Account
    }

    input InputCode{
        element: String,
        group: String,
        account: String,
        subaccount: String,
        auxiliary: String,
    }

    input AccountInput{
        id: ID        
        name: String,        
        parent_id: ID,
        code: InputCode,
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
        createAccount(name: String, parent_id: String, code: AccountCode): Account,
        deleteAccount(id: ID!): String,
        updateAccount(id: ID!, account: AccountInput): Account,
    }
`
