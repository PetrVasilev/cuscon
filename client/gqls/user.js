import { gql } from '@apollo/client'

export const REGISTER_USER = gql`
    mutation($data: UserRegisterInput!) {
        registerUser(data: $data)
    }
`

export const LOGIN_USER = gql`
    mutation($data: UserLoginInput!) {
        loginUser(data: $data)
    }
`

export const EDIT_USER_PASSWORD = gql`
    mutation($data: UserPasswordInput!) {
        editUserPassword(data: $data) {
            _id
            name
            email
            created
        }
    }
`

export const GET_USER = gql`
    {
        user {
            _id
            name
            email
            created
        }
    }
`
