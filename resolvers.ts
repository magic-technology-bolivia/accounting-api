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
                      { $cond: [ { $ne: [ '$code.group', null ] }, {$concat: ['.', '$code.group']}, '' ] },
                      { $cond: [ { $ne: [ '$code.account', null ] }, {$concat: ['.', '$code.account']}, '' ] },
                      { $cond: [ { $ne: [ '$code.subaccount', null ] }, {$concat: ['.','$code.subaccount']}, '' ] },
                      { $cond: [ { $ne: [ '$code.auxiliary', null ] }, {$concat: ['.','$code.auxiliary']}, '' ] },
                    ]
                  }
                }
              },
              {
                $sort: {updatedAt: -1}
              }
            ]);

            return accounts;
        },
        allCurrencies: async () => {
            const currencies = await Currency.find();
            return currencies;
        },
        allTransactions: async () => {
          const transactions = await Transaction.aggregate([
            {
              $facet: {
                transactionsList: [
                  {
                    $addFields: {
                      createdAtFriendly: { $dateToString: { format: "%d\/%m\/%Y %H:%M", date: "$createdAt" } }
                    }
                  },
                  {
                    $sort: {createdAt: -1}
                  }
                ],
                transactionsTotal: [
                  {
                    $group: {
                      _id: "$type",
                      total: { $sum: "$amount" },
                    }
                  },
                  {
                    $sort: {_id: 1}
                  }
                ]
              }
            }
          ]);
          
          return transactions;
        },

        accountBy: async (_: any, args: any) => {
          const {accountId} = args;
            const account = await Account.findById(accountId);
            return account;
        },

        dollibarrGetCategories: async() =>{
          return "hello 1";
          //return Dolibarr.getCategories();
        },
        productReport: async() => {
          return "hello 2";
          //return Dolibarr.detailListProductStock(true);
        }
    },
    Mutation: {
        createAccount: async (_: any, args: any) => {
            const {name} = args;
            let {parentId} = args;
            const {currencyId} = args;
            const {authorId} = args;
            const {parentLevel} = args;
            const {code} = args;

            //console.log(args);

            let level = 1;

            let newAccountData = {name, currencyId, authorId, code, level, parentId};


            if(parentLevel)
              level = parseInt(parentLevel)+1;

            if(parentId && parentId !== ""){
              console.log("parentId", parentId);
              newAccountData = {...newAccountData, parentId: parentId};
            }

            //console.log(newAccountData);

            const newAccount = new Account(newAccountData);
            await newAccount.save();
            return newAccount;
        },
        createTransaction: async (_: any, args: any) => {
          const {createdAt} = args;
          const {reference} = args;
          const {type} = args;
          const {amount} = args;

          const newTransaction = new Transaction({createdAt, reference, type, amount});
          await newTransaction.save();
          return newTransaction;
        },
        async deleteAccount(_: any, {id}: any){
          const accountDeleted = await Account.findByIdAndDelete(id);
          return accountDeleted;
        },
        async deleteTransaction(_: any, {_id}: any){
          let transactionDeleted = Transaction.findByIdAndDelete(_id);
          return transactionDeleted;
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
