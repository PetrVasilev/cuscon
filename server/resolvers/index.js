const user = require('./user')
const order = require('./order')
const request = require('./request')

module.exports = {
    Query: {
        ...user.Query,
        ...order.Query,
        ...request.Query
    },
    Mutation: {
        ...user.Mutation,
        ...order.Mutation,
        ...request.Mutation
    },
    Order: order.Population,
    Request: request.Population
}
