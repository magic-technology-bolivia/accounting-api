const {Schema, model} = require('mongoose');

const transactionSchema = new Schema({
    reference: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
});

transactionSchema.set('timestamps', true);

module.exports = model("Transaction", transactionSchema);