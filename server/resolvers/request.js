const Request = require('../models/Request')
const Order = require('../models/Order')
const User = require('../models/User')

module.exports = {
    Query: {
        orderRequests: async (_, { where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            const order = await Order.findOne({
                deleted: false,
                creator: permission._id,
                _id: where._id
            })
            if (!order) throw new Error('not-found')
            return await Request.find({
                order: order._id
            })
        },
        userRequests: async (_, {}, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            return await Request.find({ user: permission._id })
        }
    },
    Mutation: {
        createRequest: async (_, { data, where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            const request = new Request({
                ...data,
                user: permission._id,
                order: where._id
            })
            return await request.save()
        },
        acceptRequest: async (_, { where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            const request = await Request.findById(where._id)
            if (!request) throw new Error('not-found')
            const order = await Order.findOne({ _id: request.order, creator: permission._id })
            if (!order) throw new Error('not-found')
            request.status = 'ACCEPTED'
            order.freelancer = request.user
            order.status = 'IN_PROGRESS'
            await Promise.all([
                order.save(),
                Request.updateMany(
                    { order: order._id, _id: { $ne: request._id } },
                    { status: 'DENIED' }
                )
            ])
            return await request.save()
        },
        deniedRequest: async (_, { where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            const request = await Request.findById(where._id)
            if (!request) throw new Error('not-found')
            const order = await Order.findOne({ _id: request.order, creator: permission._id })
            if (!order) throw new Error('not-found')
            request.status = 'DENIED'
            return await request.save()
        }
    },
    Population: {
        user: async (request) => {
            return await User.findById(request.user)
        },
        order: async (request) => {
            return await Order.findById(request.order)
        }
    }
}
