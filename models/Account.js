const {Schema, model} = require('mongoose');

const accountSchema = new Schema({
    code:{
        type: String,
        required: true
    },    
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
    },
    authorId: {
        type: Schema.Types.ObjectId,
    },
    currencyId:{
        type: Schema.Types.ObjectId,
    },
    code: {           
        element: { 
            type: String,
        },
        group: {
            type: String,
        },
        account: {
            type: String,
        },
        subaccount: {
            type: String,
        },
        auxiliary: {
            type: String,
        }
    },    
    class: {   
        type: String,
    },
    level: {
        type: Number,
    },
    byDocument: {
        type: Number,
        min: 0,
        max: 1
    },
    byCost: {  
        type: Number,
        min: 0,
        max: 1
    }
});

accountSchema.set('timestamps', true)

module.exports = model("Account", accountSchema);