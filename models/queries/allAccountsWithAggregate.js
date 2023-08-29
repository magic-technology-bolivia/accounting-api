/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('test');

// Search for documents in the current collection.
db.getCollection('accounts').aggregate([
    { $addFields: {
      "friendly_code": {
        $concat: 
        [
          "$code.element",
          { $cond: [ { $ne: [ '$code.group', "" ] }, {$concat: ['.', '$code.group']}, '' ] },
          { $cond: [ { $ne: [ '$code.account', "" ] }, {$concat: ['.', '$code.account']}, '' ] },
          { $cond: [ { $ne: [ '$code.subaccount', "" ] }, {$concat: ['.','$code.subaccount']}, '' ] },        
          { $cond: [ { $ne: [ '$code.auxiliary', "" ] }, {$concat: ['.','$code.auxiliary']}, '' ] },
        ]
      }
    }
  }
]);