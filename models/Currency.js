const {Schema, model} = require('mongoose');

const currencySchema = new Schema({
    fullname: {
        type: String,
        required: true
    },    
    prefix: {
        type: String,
        required: true
    },
    country: {
        type: String,
    },
});

module.exports = model("Currency", currencySchema);