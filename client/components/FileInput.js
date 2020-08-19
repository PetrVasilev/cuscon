import React from 'react'
import styled from 'styled-components'

const View = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;

    input {
        margin-top: 10px;
    }

    label {
        font-size: 14px;
    }
`

const FileInput = ({ label, accept, ...props }) => {
    return (
        <View>
            {label && <label>{label}</label>}
            <input type="file" accept={accept} {...props} />
        </View>
    )
}

export default FileInput
