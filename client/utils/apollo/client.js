import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'

import fetch from 'isomorphic-unfetch'
import cookie from 'cookie'

export const host =
    process.env.NODE_ENV === 'production' ? `https://cuscon.ru` : 'http://localhost:3000'

export default function createApolloClient(initialState, ctx) {
    const isServer = typeof window === 'undefined'

    const graphQLUrl =
        process.env.NODE_ENV !== 'production'
            ? `${host}/graphql`
            : isServer
            ? `http://localhost:3000/graphql`
            : `${host}/graphql`

    const httpLink = createUploadLink({
        uri: graphQLUrl,
        credentials: 'same-origin',
        fetch
    })

    const contextLink = setContext(async () => {
        const parsingCookie = isServer ? ctx?.req?.headers?.cookie : document.cookie
        const cookies = cookie.parse(parsingCookie)
        return {
            headers: {
                authorization: cookies ? cookies.token : ''
            }
        }
    })

    const link = ApolloLink.from([contextLink, httpLink])

    return new ApolloClient({
        ssrMode: isServer,
        link,
        cache: new InMemoryCache().restore(initialState || {})
    })
}
