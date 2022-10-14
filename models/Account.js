const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema({
    email: {
        unique: true,
        type: String
    },
    password: {
        type: String
    },
    attributes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
    }
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;