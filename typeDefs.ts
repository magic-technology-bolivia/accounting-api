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
    type Currency{
        _id: ID,
        fullname: String,
        prefix: String,
        country: String,
    }
    type Transaction{
        _id: ID,
        createdAt: String,
        createdAtFriendly: String,
        reference: String,
        type: String,
        amount: String,        
    }
    
    type Account {
        _id: ID
        name: String,        
        parentId: ID,
        currencyId: ID,
        authorId: ID,
        code: Code,        
        friendlyCode: String,
        updatedAt: String,
        class: String,
        level: Int,
        currency: Currency,
        byDocument: Int,
        byCost: Int
        author: User
    }
    type productReportData{
        code: String,        
        description: String,
        physicalStock: String,
    }
    type ProductReport{
        result: Boolean,
        data: [productReportData],        
        message: String,
    }
    type DolibarrCategory{
        id: ID,
        label: String,
        description: String,
    }
    type AtomicTransactionsTotal{
        _id: String,
        total: Float,        
    }
    type QueryTransaction{
        transactionsList: [Transaction],
        transactionsTotal: [AtomicTransactionsTotal],
    }

    type Query {
        hello:String,
        allAccounts: [Account],
        allCurrencies: [Currency],
        allTransactions: [QueryTransaction],
        accountBy(accountId:ID!): Account,
        dollibarrGetCategories: [DolibarrCategory],
        productReport: ProductReport,
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
        parentId: ID,        
        currencyId: ID,
        authorId: ID,
        code: CodeInput,
        class: String,
        level: Int,
        currency: String,
        byDocument: Int,
        byCost: Int,
    }

    input AccountCode{
        element: String,
        group: String,
        account: String,
        subaccount: String,
        auxiliary: String,
    }

    type Mutation {
        createTransaction(createdAt: String, reference: String, type: String, amount: Float): Transaction,
        createAccount(name: String, parentId: String, currencyId: String, authorId: String, level: String, code: AccountCode): Account,
        deleteAccount(_id: ID!): String,
        deleteTransaction(_id: ID!): String,
        updateAccount(_id: ID!, account: AccountInput): Account,
    }
`
