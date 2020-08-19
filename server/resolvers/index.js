const admin = require('./admin')
const user = require('./user')
const order = require('./order')
const request = require('./request')

module.exports = {
    Query: {
        ...admin.Query,
        ...user.Query,
        ...order.Query,
        ...request.Query
    },
    Mutation: {
        ...admin.Mutation,
        ...user.Mutation,
        ...order.Mutation,
        ...request.Mutation
    },
    Order: order.Population,
    Request: request.Population
}
