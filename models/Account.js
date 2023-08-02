const {Schema, model} = require('mongoose');

const accountSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    parent_id: {
        type: Schema.Types.ObjectId,
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