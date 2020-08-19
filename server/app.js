const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const express = require('express')

const resolvers = require('./resolvers')
const { user } = require('./utils/auth')

dotenv.config()

mongoose
    .connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('MONGO: connected'))
    .catch((err) => {
        throw err
    })

const server = new GraphQLServer({
    typeDefs: 'schemas/index.graphql',
    resolvers,
    context: ({ request }) => {
        const { authorization } = request.headers
        return {
            authUser: () => user(authorization)
        }
    }
})
const port = process.env.PORT || 3000

server.express.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})
server.express.use('/uploads', express.static(__dirname + '/../uploads/'))

server.start(
    {
        port,
        endpoint: '/graphql',
        playground: '/playground',
        bodyParserOptions: { type: 'application/json' },
        debug: process.env.NODE_ENV === 'production' ? false : true
    },
    () => {
        console.log(`SERVER: started on port ${port}`)
        require('./models/User').initDB()
    }
)
