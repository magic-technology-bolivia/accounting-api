const Account = require('./models/Account')

export const resolvers = {
    Query: {
        hello: () => 'Hello World',
        getAllAccounts: async () => {
            const accounts = await Account.aggregate([
                {
                  $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "id",
                    as: "author"
                  }
                },
                {
                  $unwind: "$author"
                },
                {
                  $addFields: {
                    "friendly_code": {
                      $concat: [
                        "$code.element",
                        { $cond: [ { $ne: [ '$code.group', "" ] }, {$concat: ['.', '$code.group']}, '' ] },
                        { $cond: [ { $ne: [ '$code.account', "" ] }, {$concat: ['.', '$code.account']}, '' ] },
                        { $cond: [ { $ne: [ '$code.subaccount', "" ] }, {$concat: ['.','$code.subaccount']}, '' ] },
                        { $cond: [ { $ne: [ '$code.auxiliary', "" ] }, {$concat: ['.','$code.auxiliary']}, '' ] },
                      ]
                    }
                  }
                },    
              ]);
              
            return accounts
        },
        getAccount: async (_: any, args: any) => {
            const account = await Account.findById(args.id);
            return account;
        }
    },
    Mutation: {
        createAccount: async (_: any, args: any) => {
            
            const {name} = args;
            const {parent_id} = args;
            const {author_id} = args;
            const {level} = args;
            const {code} = args;

            const newAccount = new Account({name, parent_id, author_id, level, code});
            await newAccount.save();
            
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
