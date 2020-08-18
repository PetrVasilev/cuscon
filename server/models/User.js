const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    created: { type: Date, default: Date.now }
})

schema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    try {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
        next()
    } catch (err) {
        throw err
    }
})

module.exports = mongoose.model('User', schema)
