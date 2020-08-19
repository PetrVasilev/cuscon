import { useQuery } from '@apollo/client'

import { GET_USER } from '../gqls/user'

export const useUser = (params = {}) => {
    const { onCompleted } = params
    const { data, loading } = useQuery(GET_USER, {
        onCompleted
    })
    const user = data ? data.user : null
    return {
        loading,
        user
    }
}
