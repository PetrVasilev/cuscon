import React from 'react'
import styled from 'styled-components'

import Spinner from './Spinner'

const View = styled.button`
    height: 35px;
    background: #359681;
    color: white;
    padding: 0 20px;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
    transition: 0.3s opacity;
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 0.8;
    }

    &:disabled {
        opacity: 0.8;
        cursor: default;
    }
`

const Button = ({ children, loading, ...props }) => {
    return (
        <View disabled={loading} {...props}>
            {loading ? (
                <Spinner
                    width="3px"
                    size="15px"
                    color={'white'}
                    secondColor={`rgba(255, 255, 255, 0.2)`}
                />
            ) : (
                children
            )}
        </View>
    )
}

export default Button
