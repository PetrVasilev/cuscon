import React from 'react'
import styled from 'styled-components'

const View = styled.div`
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    display: block;
    box-sizing: border-box;

    ${(props) =>
        props.disableInMobile
            ? null
            : `
                @media only screen and (max-width: 1000px) {
                    padding: 0 15px;
                }
            `}
`

const Padding = ({ children, className, disableInMobile }) => {
    return (
        <View className={className} disableInMobile={disableInMobile}>
            {children}
        </View>
    )
}

export default Padding
