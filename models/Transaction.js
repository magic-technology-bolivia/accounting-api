const {Schema, model} = require('mongoose');

const transactionSchema = new Schema({
    createdAt: { 
        type: Date,
        default: Date.now
    },
    reference: {
        type: String,
        required: true
    },    
    type:{
        type: String,
        required: true,
        enum: ['ingreso', 'egreso']
    },
    amount: {
        type: Number,
        default: 0,
        min: 0,
    }
},
{
    timestamps: {updatedAt: true }
});


module.exports = model("Transaction", transactionSchema);