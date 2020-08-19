import React from 'react'
import Head from 'next/head'

import GlobalStyles from '../components/GlobalStyles'
import Header from '../components/Header'
import { withApollo } from '../utils/apollo'

const MyApp = ({ Component, pageProps, cookie }) => {
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
                />
                <title>CusCon - Фриланс биржа</title>
            </Head>

            <Header />
            <Component {...pageProps} />

            <GlobalStyles />
        </>
    )
}

export default withApollo({ ssr: true })(MyApp)
