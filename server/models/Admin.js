const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({
    login: String,
    password: String
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
    const Admin = this
    const login = process.env.ADMIN_LOGIN
    const password = process.env.ADMIN_PASSWORD
    try {
        const admin = await Admin.findOne({ login })
        if (!admin) {
            const newAdmin = new Admin({
                login,
                password
            })
            await newAdmin.save()
            console.log(`ADMIN: created`)
        }
    } catch (err) {
        throw err
    }
}

module.exports = mongoose.model('Admin', schema)
