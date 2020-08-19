import React, { useState } from 'react'
import styled from 'styled-components'
import { useMutation } from '@apollo/client'

import Input from '../../components/Input'
import Button from '../../components/Button'
import { EDIT_USER_PASSWORD } from '../../gqls/user'
import { useUser } from '../../utils/hooks'

const View = styled.div`
    margin: 0 auto;
    background: white;
    padding: 16px 20px;
    margin-top: 20px;
    max-width: 400px;
    border: 1px solid #dedede;

    @media only screen and (max-width: 400px) {
        padding: 15px;
    }

    .title {
        font-size: 16px;
        font-weight: 400;
        margin-bottom: 15px;
    }
`

const Form = styled.form`
    .actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 20px;

        .helper {
            margin-left: 15px;
            text-decoration: none;
            color: #359681;
            font-weight: 400;
            transition: 0.3s opacity;

            &:hover {
                opacity: 0.8;
            }
        }
    }

    .error {
        color: #e80000;
        font-weight: 400;
        margin-bottom: -4px;
    }

    .success {
        color: green;
        font-weight: 400;
        margin-bottom: -4px;
    }
`

const EditPassword = () => {
    const { user } = useUser()

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const [editPassword, { loading }] = useMutation(EDIT_USER_PASSWORD, {
        onCompleted: () => {
            setSuccess('Пароль успешно изменен')
        },
        onError: (err) => {
            console.error(err)
            setError('Неправильный текущий пароль')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const currentPassword = e.target.currentPassword.value
        const newPassword = e.target.newPassword.value
        const repeatPassword = e.target.repeatPassword.value
        if (newPassword !== repeatPassword) {
            return setError('Пароли должны совпадать')
        }
        setError(null)
        setSuccess(null)
        editPassword({
            variables: {
                data: {
                    currentPassword,
                    newPassword
                }
            }
        })
    }

    if (!user) return null

    return (
        <View>
            <div className="title">Изменить пароль</div>
            <Form onSubmit={handleSubmit}>
                <Input label="Текущий пароль" type="password" name="currentPassword" required />
                <Input label="Новый пароль" type="password" name="newPassword" required />
                <Input label="Повторите пароль" type="password" name="repeatPassword" required />
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <div className="actions">
                    <Button loading={loading} type="submit">
                        Изменить
                    </Button>
                </div>
            </Form>
        </View>
    )
}

export default EditPassword
