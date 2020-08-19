const jwt = require('jsonwebtoken')

const User = require('../models/User')

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

module.exports = { user }
