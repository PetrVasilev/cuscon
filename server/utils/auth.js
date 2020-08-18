const jwt = require('jsonwebtoken')

const Admin = require('../models/Admin')
const User = require('../models/User')

const admin = async (authorization) => {
    if (!authorization) return null
    try {
        const decoded = jwt.verify(authorization, process.env.ADMIN_SECRET)
        const admin = await Admin.findById(decoded._id)
        if (!admin) return null
        return admin
    } catch (err) {
        return null
    }
}

const user = async (authorization) => {
    if (!authorization) return null
    try {
        const decoded = jwt.verify(authorization, process.env.USER_SECRET)
        const user = await User.findById(decoded._id)
        if (!user) return null
        return user
    } catch (err) {
        return null
    }
}

module.exports = {
    admin,
    user
}
