import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import Router from 'next/router'
import cookie from 'cookie'

import Padding from './Padding'
import UserIcon from './icons/user.svg'
import LogoutIcon from './icons/logout.svg'
import { useUser } from '../utils/hooks'

const View = styled.div`
    padding: 18px 0;
    background: #359681;

    .content {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        color: white;
    }
`

const Logo = styled.div`
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s opacity;

    &:hover {
        opacity: 0.8;
    }
`

const Menu = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    .profile {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        transition: 0.3s opacity;

        &:hover {
            opacity: 0.8;
        }

        .name {
            font-size: 14px;
            margin-right: 8px;

            @media only screen and (max-width: 400px) {
                display: none;
            }
        }
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
            fill: white;
            width: 18px;
            height: 18px;
        }
    }

    .logout {
        margin-left: 20px;
        cursor: pointer;
        transition: 0.3s opacity;

        &:hover {
            opacity: 0.8;
        }

        svg {
            fill: white;
            width: 20px;
            height: 20px;
        }
    }
`

const Auth = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    .item {
        cursor: pointer;
        transition: 0.3s opacity;

        &:hover {
            opacity: 0.8;
        }
    }

    .separator {
        margin: 0 7px;
    }
`

const Header = () => {
    const { user } = useUser()

    const logout = async () => {
        document.cookie = cookie.serialize('token', '', {
            maxAge: -1
        })
        window.location.href = '/login'
    }

    return (
        <View>
            <Padding className="content">
                <Link href="/">
                    <Logo>CusCon Фриланс</Logo>
                </Link>
                {user ? (
                    <Menu>
                        <div onClick={() => Router.push('/profile')} className="profile">
                            <div className="name">{user.name}</div>
                            <div className="icon">
                                <UserIcon />
                            </div>
                        </div>
                        <div onClick={logout} className="icon logout">
                            <LogoutIcon />
                        </div>
                    </Menu>
                ) : (
                    <Auth>
                        <Link href="/login">
                            <div className="item">Вход</div>
                        </Link>
                        <div className="separator">/</div>
                        <Link href="/register">
                            <div className="item">Регистрация</div>
                        </Link>
                    </Auth>
                )}
            </Padding>
        </View>
    )
}

export default Header
