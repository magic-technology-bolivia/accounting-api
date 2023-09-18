const Account = require('./models/Account')
const Currency = require('./models/Currency')
const Transaction = require('./models/Transaction')
const Dolibarr = require('./models/dolibarr/Dolibarr.model')

export const resolvers = {
    Query: {
        hello: () => 'Hello World',
        allAccounts: async () => {
            const accounts = await Account.aggregate([
              {
                $lookup: {
                  from: 'users',
                  localField: 'authorId',
                  foreignField: '_id',
                  as: 'author'
                }
              },               
              {
                $unwind: "$author"
              },
              {
                $lookup: {
                  from: 'currencies',
                  localField: 'currencyId',
                  foreignField: '_id',
                  as: 'currency'
                }
              },      
              {
                $unwind: "$currency"
              },
              {
                $addFields: {
                  "friendlyCode": {
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
              {
                $sort: {updateAt: -1}
              }
            ])

            return accounts;
        },
        allCurrencies: async () => {
            const currencies = await Currency.find();
            return currencies;
        },
        allTransactions: async () => {
          const transactions = await Transaction.aggregate( [ {
            $project: {
               date: {
                  $dateFromString: {
                     dateString: '$date',
                     timezone: '$timezone',
                     onNull: new Date(0)
                  }
               }
            }
         } ] )
          return transactions;
        },

        accountBy: async (_: any, args: any) => {
          const {accountId} = args;
            const account = await Account.findById(accountId);
            return account;
        },

        dollibarrGetCategories: async() =>{
          return Dolibarr.getCategories();
        },
        productReport: async() => {
          return Dolibarr.detailListProductStock(true);
        }
    },
    Mutation: {
        createAccount: async (_: any, args: any) => {            
            const {name} = args;
            const {parentId} = args;
            const {currencyId} = args;
            const {authorId} = args;            
            const {level} = args;
            const {code} = args;

            const newAccount = new Account({name, parentId, currencyId, authorId, level, code});
            await newAccount.save();            
            return newAccount;
        },
        createTransaction: async (_: any, args: any) => {            
          const {createdAt} = args;
          const {reference} = args;
          const {type} = args;
          const {amountIn} = args;
          const {amountOut} = args;

          const newTransaction = new Transaction({createdAt, reference, type, amountIn, amountOut});
          await newTransaction.save();            
          return newTransaction;
        },
        async deleteAccount(_: any, {_id}: any){
            await Account.findByIdAndDelete(_id);
            return "Account deleted";
        },
        async deleteTransaction(_: any, {_id}: any){
          await Transaction.findByIdAndDelete(_id);
          return "Transaction deleted";
        },
        async updateAccount(_: any, {account, _id}: any){
            const accountUpdated = await Account.findByIdAndUpdate(_id, account, {
              $set: account
            },
            {new:true});

            console.log(accountUpdated, _id);
            return accountUpdated
        }
    }
}
