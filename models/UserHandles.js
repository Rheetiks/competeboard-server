const mongoose = require('mongoose');

const userHandlesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true 
    },
    codeforces: {
        type: String,
        required: false
    },
    codechef: {
        type: String,
        required: false
    },
    leetcode: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('UserHandles', userHandlesSchema);
