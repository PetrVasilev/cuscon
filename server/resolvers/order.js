const Order = require('../models/Order')
const User = require('../models/User')
const Request = require('../models/Request')

const { processUpload, deleteFile } = require('../utils/upload')

module.exports = {
    Query: {
        order: async (_, { where }) => {
            const order = await Order.findOne({ _id: where._id, deleted: false })
            if (!order) throw new Error('not-found')
            return order
        },
        orders: async (_, { skip, limit, where }) => {
            return await Order.find({ deleted: false, ...where })
                .sort('-created')
                .skip(skip)
                .limit(limit)
        },
        creatorOrders: async (_, { where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            return await Order.find({ deleted: false, creator: permission._id, ...where }).sort(
                '-created'
            )
        },
        freelancerOrders: async (_, { where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            return await Order.find({
                deleted: false,
                freelancer: permission._id,
                ...where
            }).sort('-created')
        }
    },
    Mutation: {
        createOrder: async (_, { data }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            if (data.image) {
                const filename = await processUpload(data.image)
                data['image'] = filename
            }
            const order = new Order({ ...data, creator: permission._id })
            return await order.save()
        },
        editOrder: async (_, { data, where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            const exist = await Order.findOne({ creator: permission._id, _id: where._id })
            if (!exist) throw new Error('not-found')
            if (data.image) {
                const filename = await processUpload(data.image)
                deleteFile(exist.image)
                data['image'] = filename
            }
            return await Order.findByIdAndUpdate(where._id, data, { new: true })
        },
        deleteOrder: async (_, { where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            const exist = await Order.findOne({ creator: permission._id, _id: where._id })
            if (!exist) throw new Error('not-found')
            return await Order.findByIdAndUpdate(where._id, { deleted: true }, { new: true })
        },
        deleteOrderAdmin: async (_, { where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            if (!permission.isAdmin) throw new Error('no-access')
            const order = await Order.findByIdAndUpdate(where._id, { deleted: true }, { new: true })
            return order
        },
        finishOrder: async (_, { where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            const order = await Order.findOne({ _id: where._id, freelancer: permission._id })
            if (!order) throw new Error('not-found')
            order.status = 'ACCEPT_WAITING'
            return await order.save()
        },
        confirmFinishOrder: async (_, { where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            const order = await Order.findOne({ _id: where._id, creator: permission._id })
            if (!order) throw new Error('not-found')
            order.status = 'FINISHED'
            return await order.save()
        },
        cancelFinishOrder: async (_, { where }, { authUser }) => {
            const permission = await authUser()
            if (!permission) throw new Error('no-access')
            const order = await Order.findOne({ _id: where._id, creator: permission._id })
            if (!order) throw new Error('not-found')
            order.status = 'IN_PROGRESS'
            return await order.save()
        }
    },
    Population: {
        creator: async (order) => {
            return await User.findById(order.creator)
        },
        freelancer: async (order) => {
            return await User.findById(order.freelancer)
        },
        requestsCount: async (order) => {
            return await Request.find({ order: order._id, status: 'NEW' }).countDocuments()
        }
    }
}
