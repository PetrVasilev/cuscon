import { gql } from '@apollo/client'

export const CREATE_ORDER = gql`
    mutation($data: OrderCreateInput!) {
        createOrder(data: $data) {
            _id
            title
            description
            price
            image
            status
            deadline
            created
            creator {
                _id
                name
            }
            freelancer {
                _id
                name
                email
            }
            requestsCount
        }
    }
`

export const DELETE_ORDER = gql`
    mutation($where: OrderWhereInput!) {
        deleteOrder(where: $where) {
            _id
        }
    }
`

export const GET_ORDERS = gql`
    query($where: OrdersWhereInput!) {
        orders(where: $where) {
            _id
            title
            description
            price
            image
            status
            deadline
            created
            creator {
                _id
                name
            }
            freelancer {
                _id
                name
                email
            }
            requestsCount
        }
    }
`

export const GET_ORDER = gql`
    query($where: OrderWhereInput!) {
        order(where: $where) {
            _id
            title
            description
            price
            image
            status
            deadline
            created
            creator {
                _id
                name
            }
            freelancer {
                _id
                name
                email
            }
            requestsCount
        }
    }
`

export const GET_CREATOR_ORDERS = gql`
    query($where: OrdersWhereInput) {
        creatorOrders(where: $where) {
            _id
            title
            description
            price
            image
            status
            deadline
            created
            creator {
                _id
                name
            }
            freelancer {
                _id
                name
                email
            }
            requestsCount
        }
    }
`

export const GET_FREELANCER_ORDERS = gql`
    query($where: OrdersWhereInput) {
        freelancerOrder(where: $where) {
            _id
            title
            description
            price
            image
            status
            deadline
            created
            creator {
                _id
                name
            }
            freelancer {
                _id
                name
                email
            }
            requestsCount
        }
    }
`

export const FINISH_ORDER = gql`
    mutation($where: OrderWhereInput!) {
        finishOrder(where: $where) {
            _id
            title
            description
            price
            image
            status
            deadline
            created
            creator {
                _id
                name
            }
            freelancer {
                _id
                name
                email
            }
            requestsCount
        }
    }
`

export const CONFIRM_FINISH_ORDER = gql`
    mutation($where: OrderWhereInput!) {
        confirmFinishOrder(where: $where) {
            _id
            title
            description
            price
            image
            status
            deadline
            created
            creator {
                _id
                name
            }
            freelancer {
                _id
                name
                email
            }
            requestsCount
        }
    }
`

export const CANCEL_FINISH_ORDER = gql`
    mutation($where: OrderWhereInput!) {
        cancelFinishOrder(where: $where) {
            _id
            title
            description
            price
            image
            status
            deadline
            created
            creator {
                _id
                name
            }
            freelancer {
                _id
                name
                email
            }
            requestsCount
        }
    }
`

export const DELETE_ORDER_ADMIN = gql`
    mutation($where: OrderWhereInput!) {
        deleteOrderAdmin(where: $where) {
            _id
            title
            description
            price
            image
            status
            deadline
            created
            creator {
                _id
                name
            }
            freelancer {
                _id
                name
                email
            }
            requestsCount
        }
    }
`
