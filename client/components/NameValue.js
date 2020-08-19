import React from 'react'
import styled from 'styled-components'

const View = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-bottom: ${(props) => (props.last ? '0' : '12px')};

    .label {
        width: 30%;
    }

    .value {
        width: 70%;
        font-weight: 400;
    }
`

const NameValue = ({ label, value, last = false }) => {
    return (
        <View last={last}>
            <div className="label">{label}</div>
            <div className="value">{value}</div>
        </View>
    )
}

export default NameValue
