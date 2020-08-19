import React from 'react'
import styled from 'styled-components'

const View = styled.div`
    .loader {
        border: ${(props) => props.width} solid ${(props) => props.secondColor};
        border-radius: 50%;
        border-top: ${(props) => props.width} solid ${(props) => props.color};
        width: ${(props) => props.size};
        height: ${(props) => props.size};
        -webkit-animation: spin 0.65s linear infinite;
        animation: spin 0.65s linear infinite;
    }

    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`

const Spinner = ({
    size = '20px',
    width = '3px',
    color = '#359681',
    secondColor = 'rgba(53, 150, 129, 0.2)'
}) => {
    return (
        <View width={width} size={size} color={color} secondColor={secondColor}>
            <div className="loader" />
        </View>
    )
}

export default Spinner
