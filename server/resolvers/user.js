const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

module.exports = {
    Query: {
        user: async (_, {}, { authUser }) => {
            const user = await authUser()
            if (!user) throw new Error('no-access')
            return user
        }
    },
    Mutation: {
        loginUser: async (_, { data }) => {
            const { email, password } = data
            const user = await User.findOne({ email })
            if (!user) throw new Error('not-found')
            const isValidPassword = await bcrypt.compare(password, user.password)
            if (!isValidPassword) throw new Error('no-access')
            const token = jwt.sign({ _id: user._id }, process.env.USER_SECRET)
            return token
        },
        registerUser: async (_, { data }) => {
            const { email, password, name } = data
            const exist = await User.findOne({ email })
            if (exist) throw new Error('already-exist')
            const user = new User({
                email,
                password,
                name
            })
            const saved = await user.save()
            const token = jwt.sign({ _id: saved._id }, process.env.USER_SECRET)
            return token
        },
        editUserPassword: async (_, { data }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            const { currentPassword, newPassword } = data
            const user = await User.findById(permission._id)
            if (!user) throw new Error('not-found')
            const isValidPassword = await bcrypt.compare(currentPassword, user.password)
            if (!isValidPassword) throw new Error('no-access')
            user.password = newPassword
            return await user.save()
        }
    }
}
