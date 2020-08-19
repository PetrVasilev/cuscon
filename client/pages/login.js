import React, { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import cookie from 'cookie'
import { useMutation } from '@apollo/client'

import Input from '../components/Input'
import Button from '../components/Button'
import { LOGIN_USER } from '../gqls/user'

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
`

const Login = () => {
    const [error, setError] = useState(null)

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        onCompleted: ({ loginUser: token }) => {
            document.cookie = cookie.serialize('token', token, {
                sameSite: true,
                path: '/',
                maxAge: 30 * 24 * 60 * 60
            })
            window.location.href = '/profile'
        },
        onError: (err) => {
            console.error(err)
            setError('Неправильный Email или Пароль')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value
        const data = {
            email,
            password
        }
        setError(null)
        loginUser({
            variables: { data }
        })
    }

    return (
        <View>
            <div className="title">Вход в профиль</div>
            <Form onSubmit={handleSubmit}>
                <Input label="Email" type="email" name="email" required />
                <Input label="Пароль" type="password" name="password" required />
                {error && <div className="error">{error}</div>}
                <div className="actions">
                    <Button loading={loading} type="submit">
                        Войти
                    </Button>
                    <Link href="/register">
                        <a className="helper">Регистрация</a>
                    </Link>
                </div>
            </Form>
        </View>
    )
}

export default Login
