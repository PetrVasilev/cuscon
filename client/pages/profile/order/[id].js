import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

import { GET_ORDER } from '../../../gqls/order'
import { GET_ORDER_REQUESTS } from '../../../gqls/request'
import { host } from '../../../utils/apollo/client'
import NameValue from '../../../components/NameValue'
import Padding from '../../../components/Padding'
import Button from '../../../components/Button'

const View = styled.div`
    background: white;
    padding: 16px 20px;
    margin-top: 20px;
    border: 1px solid #dedede;

    @media only screen and (max-width: 400px) {
        padding: 15px;
    }

    .title {
        font-size: 18px;
        font-weight: 400;
        margin-bottom: 20px;
    }

    .image {
        max-width: 400px;
        margin-bottom: 20px;
        object-fit: contain;
    }

    .description {
        white-space: pre-line;
        margin-bottom: 20px;
    }

    .error {
        color: #e80000;
        font-weight: 400;
        margin-top: -4px;
        margin-bottom: 15px;
    }

    .success {
        color: green;
        font-weight: 400;
    }

    .no-data {
        font-size: 14px;
    }
`

const Request = styled.div`
    border: 1px solid #cccccc;
    padding: 10px;
    margin-bottom: 15px;

    &:last-child {
        margin-bottom: 0;
    }

    .top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        @media only screen and (max-width: 530px) {
            flex-direction: column;
        }

        .user {
            .name {
                font-weight: 400;
            }
        }

        .actions {
            display: flex;
            flex-direction: row;

            @media only screen and (max-width: 530px) {
                margin-top: 10px;
                margin-bottom: 5px;
            }

            .accept {
                background: white;
                border: 1px solid green;
                color: green;
            }

            .denied {
                background: white;
                border: 1px solid darkred;
                margin-left: 10px;
                color: darkred;
            }
        }
    }

    .comment {
        white-space: pre-line;
        margin-top: 10px;
        font-weight: 400;
        color: gray;
    }

    .created {
        font-size: 14px;
        margin-top: 10px;
    }
`

const Order = ({ order, requests = [] }) => {
    if (!order) return null

    const handleAcceptRequest = () => {}

    const handleDeniedRequest = () => {}

    return (
        <Padding disableInMobile>
            <View>
                <div className="title">{order.title}</div>
                {order.image && <img className="image" src={`${host}/uploads/${order.image}`} />}
                <div className="description">{order.description}</div>
                <NameValue label="Цена" value={order.price} />
                <NameValue
                    label="Дата создания"
                    value={moment(order.created).format('DD.MM.YYYY HH:mm')}
                    last={order.deadline ? false : true}
                />
                {order.deadline && (
                    <NameValue
                        last
                        label="Срок"
                        value={moment(order.deadline).format('DD.MM.YYYY')}
                    />
                )}
            </View>
            <View style={{ marginBottom: 15 }}>
                <div className="title">Отклики</div>
                {requests.length === 0 ? (
                    <div className="no-data">Нет откликов</div>
                ) : (
                    requests
                        .filter((item) => item.status === 'NEW')
                        .map((item) => (
                            <Request key={item._id}>
                                <div className="top">
                                    <div className="user">
                                        <div className="name">{item.user.name}</div>
                                        <div className="email">{item.user.email}</div>
                                    </div>
                                    <div className="actions">
                                        <Button
                                            onClick={() => {
                                                if (confirm('Точно принять?')) {
                                                    handleAcceptRequest()
                                                }
                                            }}
                                            className="accept"
                                        >
                                            Принять
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                if (confirm('Точно отклонить?')) {
                                                    handleDeniedRequest()
                                                }
                                            }}
                                            className="denied"
                                        >
                                            Отклонить
                                        </Button>
                                    </div>
                                </div>
                                {item.comment && <div className="comment">{item.comment}</div>}
                                <div className="created">
                                    {moment(item.created).format('DD.MM.YYYY HH:mm')}
                                </div>
                            </Request>
                        ))
                )}
            </View>
        </Padding>
    )
}

Order.getInitialProps = async ({ query, apolloClient }) => {
    const { id } = query
    const [{ data: orderData }, { data: requestsData }] = await Promise.all([
        apolloClient.query({
            query: GET_ORDER,
            variables: {
                where: { _id: id }
            }
        }),
        apolloClient.query({
            query: GET_ORDER_REQUESTS,
            variables: {
                where: { _id: id }
            }
        })
    ])
    const order = orderData ? orderData.order : null
    const requests = requestsData ? requestsData.orderRequests : []
    return { order, requests }
}

export default Order
