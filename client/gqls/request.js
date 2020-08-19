import { gql } from '@apollo/client'

export const CREATE_REQUEST = gql`
    mutation($where: OrderWhereInput!, $data: RequestCreateInput) {
        createRequest(where: $where, data: $data) {
            _id
            comment
            status
            created
            user {
                _id
                name
                email
            }
            order {
                _id
                title
                status
            }
        }
    }
`

export const GET_ORDER_REQUESTS = gql`
    query($where: OrderWhereInput) {
        orderRequests(where: $where) {
            _id
            comment
            created
            status
            user {
                _id
                name
                email
            }
            order {
                _id
                title
                status
            }
        }
    }
`

export const GET_USER_REQUESTS = gql`
    {
        userRequests {
            _id
            comment
            status
            created
            user {
                _id
                name
                email
            }
            order {
                _id
                title
                status
            }
        }
    }
`

export const ACCEPT_REQUEST = gql`
    mutation($where: RequestWhereInput!) {
        acceptRequest(where: $where) {
            _id
            comment
            status
            created
            user {
                _id
                name
                email
            }
            order {
                _id
                title
                status
            }
        }
    }
`

export const DENIED_REQUEST = gql`
    mutation($where: RequestWhereInput!) {
        deniedRequest(where: $where) {
            _id
            comment
            status
            created
            user {
                _id
                name
                email
            }
            order {
                _id
                title
                status
            }
        }
    }
`
