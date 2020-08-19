import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { useQuery } from '@apollo/client'

import Spinner from '../../components/Spinner'
import Padding from '../../components/Padding'
import NameValue from '../../components/NameValue'
import { useUser } from '../../utils/hooks'
import { GET_CREATOR_ORDERS } from '../../gqls/order'
import { GET_USER_REQUESTS } from '../../gqls/request'
import NotificationIcon from '../../components/icons/notification.svg'

const View = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-sizing: border-box;

    .profile {
        width: 30%;

        .edit-pwd {
            text-decoration: none;
            color: #359681;
            font-weight: 400;
            transition: 0.3s opacity;
            margin-top: 15px;
            cursor: pointer;

            &:hover {
                opacity: 0.8;
            }
        }
    }

    .orders {
        width: 68.5%;
    }

    @media only screen and (max-width: 800px) {
        .profile {
            width: 35%;
        }

        .orders {
            width: 64%;
        }
    }

    @media only screen and (max-width: 700px) {
        flex-direction: column;

        .profile {
            width: 100%;
        }

        .orders {
            width: 100%;
            margin-left: 0;
            margin-top: 15px;
        }
    }
`

const Card = styled.div`
    border: 1px solid #dedede;
    background: white;
    padding: 16px 20px;
    box-sizing: border-box;

    @media only screen and (max-width: 400px) {
        padding: 15px;
    }

    .title {
        font-size: 16px;
        font-weight: 400;
        margin-bottom: 15px;
    }

    .no-data {
        margin-top: -5px;
    }
`

const Order = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    &:last-child {
        margin-bottom: 0;
    }

    .left {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-right: 10px;

        .requests {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-left: 10px;

            .text {
                margin-right: 2px;
            }

            svg {
                width: 15px;
                height: 15px;

                path {
                    stroke: red;
                }
            }
        }
    }

    .name {
        font-size: 14px;
        font-weight: 400;
        color: #359681;
        cursor: pointer;
        transition: 0.3s opacity;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;

        &:hover {
            opacity: 0.8;
        }
    }
`

const Profile = () => {
    const { user } = useUser()

    const { data: creatorOrdersData, loading: creatorOrdersLoading } = useQuery(GET_CREATOR_ORDERS)
    const { data: userRequestsData, loading: userRequestsLoading } = useQuery(GET_USER_REQUESTS)

    if (!user) return null

    const userRequests = userRequestsData ? userRequestsData.userRequests : []
    const creatorOrders = creatorOrdersData ? creatorOrdersData.creatorOrders : []

    return (
        <Padding disableInMobile>
            <View>
                <div className="profile">
                    <Card>
                        <div className="title">Профиль</div>
                        <div className="info">
                            <NameValue label="Email" value={user.email} />
                            <NameValue label="Имя" value={user.name} />
                            <Link href="/profile/password">
                                <div className="edit-pwd">Изменить пароль</div>
                            </Link>
                        </div>
                    </Card>
                </div>
                <div className="orders">
                    <Card>
                        <div className="title">Отклики на заказы</div>
                        {userRequestsLoading ? (
                            <Spinner />
                        ) : userRequests.length === 0 ? (
                            <div className="no-data">Вы еще не откликнулись на заказ</div>
                        ) : (
                            userRequests.map((item) => (
                                <Order key={item._id}>
                                    <Link href={`/orders/[id]`} as={`/orders/${item.order._id}`}>
                                        <div className="name">{item.order.title}</div>
                                    </Link>
                                    <div className="status">{getRequestStatus(item.status)}</div>
                                </Order>
                            ))
                        )}
                    </Card>
                    <Card style={{ marginTop: 15 }}>
                        <div className="title">Заказы</div>
                        {creatorOrdersLoading ? (
                            <Spinner />
                        ) : creatorOrders.length === 0 ? (
                            <div className="no-data">У вас нет заказов в качестве заказчика</div>
                        ) : (
                            creatorOrders.map((item) => (
                                <Order key={item._id}>
                                    <div className="left">
                                        <Link
                                            href={`/profile/order/[id]`}
                                            as={`/profile/order/${item._id}`}
                                        >
                                            <div className="name">{item.title}</div>
                                        </Link>
                                        {item.requestsCount > 0 && (
                                            <div className="requests">
                                                <div className="text">{item.requestsCount}</div>
                                                <NotificationIcon />
                                            </div>
                                        )}
                                    </div>
                                    <div className="status">{getStatus(item.status)}</div>
                                </Order>
                            ))
                        )}
                    </Card>
                </div>
            </View>
        </Padding>
    )
}

const getStatus = (status) => {
    if (status === 'NEW') {
        return <span style={{ color: 'blue' }}>Новый</span>
    }
    if (status === 'IN_PROGRESS') {
        return <span style={{ color: 'gray' }}>В работе</span>
    }
    if (status === 'ACCEPT_WAITING') {
        return <span style={{ color: 'orange' }}>На приемке</span>
    }
    if (status === 'FINISHED') {
        return <span style={{ color: 'green' }}>Выполнен</span>
    }
}

const getRequestStatus = (status) => {
    if (status === 'NEW') {
        return <span style={{ color: 'blue' }}>Ожидание</span>
    }
    if (status === 'ACCEPTED') {
        return <span style={{ color: 'green' }}>Принят</span>
    }
    if (status === 'DENIED') {
        return <span style={{ color: 'red' }}>Отклонен</span>
    }
}

export default Profile
