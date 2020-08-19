const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    comment: String,
    created: { type: Date, default: Date.now },
    status: { type: String, default: 'NEW' }, // NEW, ACCEPTED, DENIED
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
})

module.exports = mongoose.model('Request', schema)
