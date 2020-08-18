const admin = require('./admin')
const user = require('./user')

module.exports = {
    Query: {
        ...admin.Query,
        ...user.Query
    },
    Mutation: {
        ...admin.Mutation,
        ...user.Mutation
    }
}
