const Account = require('./models/Account')

export const resolvers = {
    Query: {
        hello: () => 'Hello World',
        getAllAccounts: async () => {
            const accounts = await Account.find();
            return accounts
        },
        getAccount: async (_: any, args: any) => {
            const account = await Account.findById(args.id);
            return account;
        }
    },
    Mutation: {
        createAccount: async (_: any, args: any) => {

            //console.log({parent, args, context, info});
            const {name, description} = args;
            const newAccount = new Account({name, description});
            await newAccount.save();
            console.log(newAccount);

            return newAccount;
        },
        async deleteAccount(_: any, {id}: any){
            await Account.findByIdAndDelete(id);
            return "Account deleted";
        },
        async updateAccount(_: any, {account, id}: any){
            const accountUpdated = await Account.findByIdAndUpdate(id, account, {
                $set: account
            },
            {new:true});

            console.log(accountUpdated, id);
            return accountUpdated
        }
    }
}
