const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: String,
    description: String,
    price: String,
    image: String,
    deniedComment: String,
    status: { type: String, default: 'NEW' }, // NEW, IN_PROGRESS, ACCEPT_WAITING, FINISHED
    deleted: { type: Boolean, default: false },
    deadline: { type: Date },
    created: { type: Date, default: Date.now },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Order', schema)
