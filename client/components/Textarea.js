import React from 'react'
import styled from 'styled-components'

const View = styled.div`
    margin-bottom: 15px;

    textarea {
        width: 100%;
        min-height: 100px;
        border: 1px solid #cccccc;
        box-sizing: border-box;
        padding: 7px 10px;
        margin-top: 3px;
        outline: none;
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        transition: 0.3s border;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;

        &:focus {
            border: 1px solid #359681;
        }

        @media only screen and (max-width: 500px) {
            font-size: 16px;
            height: 40px;
        }
    }

    label {
        font-size: 14px;
    }
`

const Textarea = ({ value, onChange, label, ...props }) => {
    return (
        <View>
            {label && <label>{label}</label>}
            <textarea value={value} onChange={onChange} {...props} />
        </View>
    )
}

export default Textarea
