const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user: {
        name: String,
        mail: String,
        uuid: { type: String, ref: 'User' }
    },
    account: {
        number: { type: String, unique: true },
        branch: String,
        bank: String
    },
    balance: {
        number: Number,
        currency: String
    }
});

module.exports = mongoose.model('Account', accountSchema);
