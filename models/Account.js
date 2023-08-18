const {Schema, model} = require('mongoose');

const accountSchema = new Schema({
    code:{
        type: Number,
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
    code: {
        type: Number,
    },
    class: {    
        type: String,
    },
    level: {
        type: Number,
    },    
    currency: {
        type: Number
    },
    by_document: {
        type: Boolean,
    },
    by_cost: {  
        type: Boolean,
    }
});

module.exports = model("Account", accountSchema);