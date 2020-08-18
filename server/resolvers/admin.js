const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Admin = require('../models/Admin')

module.exports = {
    Query: {
        admin: async (_, {}, { authAdmin }) => {
            const permission = await authAdmin()
            if (!permission) throw new Error('no-access')
            return permission
        }
    },
    Mutation: {
        loginAdmin: async (_, { data }) => {
            const { login, password } = data
            const admin = await Admin.findOne({ login })
            if (!admin) throw new Error('not-found')
            const isValidPassword = await bcrypt.compare(password, admin.password)
            if (!isValidPassword) throw new Error('no-access')
            const token = jwt.sign({ _id: admin._id }, process.env.ADMIN_SECRET)
            return token
        }
    }
}
