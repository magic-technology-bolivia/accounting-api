const {Schema, model} = require('mongoose');

const accountSchema = new Schema({
    code:{
        type: String,
        required: true
    },
    auxiliary:{
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    parent_id: {
        type: Schema.Types.ObjectId,
    },
    user_id: {
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
    currency: {
        type: String,
    },
    by_document: {
        type: Number,
        min: 0,
        max: 1
    },
    by_cost: {  
        type: Number,
        min: 0,
        max: 1
    }
});

module.exports = model("Account", accountSchema);