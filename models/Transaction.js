const {Schema, model} = require('mongoose');

const transactionSchema = new Schema({
    createdAt: { 
        type: Date, 
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
        required: true,
        min: 0,
    },
},
{
    timestamps: {updatedAt: true }
});


module.exports = model("Transaction", transactionSchema);