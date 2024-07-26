const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mail: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    uuid: { type: String, default: () => uuidv4().substring(0, 10), unique: true },
    contact: { type: [String] }
});

module.exports = mongoose.model('User', userSchema);
