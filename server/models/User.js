const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    isAdmin: { type: Boolean, default: false },
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

schema.statics.initDB = async function () {
    const User = this
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    try {
        const user = await User.findOne({ email })
        if (!user) {
            const newUser = new User({
                email,
                name: 'Администратор',
                isAdmin: true,
                password
            })
            await newUser.save()
            console.log(`ADMIN USER: created`)
        }
    } catch (err) {
        throw err
    }
}

module.exports = mongoose.model('User', schema)
