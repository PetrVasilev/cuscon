import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import Router from 'next/router'
import { useMutation, useQuery } from '@apollo/client'

import { GET_ORDER, CONFIRM_FINISH_ORDER, CANCEL_FINISH_ORDER } from '../../../gqls/order'
import { GET_ORDER_REQUESTS, ACCEPT_REQUEST, DENIED_REQUEST } from '../../../gqls/request'
import { host } from '../../../utils/apollo/client'
import NameValue from '../../../components/NameValue'
import Padding from '../../../components/Padding'
import Button from '../../../components/Button'
import Spinner from '../../../components/Spinner'

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

        @media only screen and (max-width: 500px) {
            width: 100%;
        }
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

const AcceptingActions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    .accept {
        background: white;
        border: 1px solid green;
        color: green;
    }

    .cancel {
        background: white;
        border: 1px solid darkred;
        margin-left: 10px;
        color: darkred;
    }
`

const Order = ({ order }) => {
    const { data: orderRequestData, loading: orderRequestLoading } = useQuery(GET_ORDER_REQUESTS, {
        variables: order
            ? {
                  where: { _id: order._id }
              }
            : null,
        fetchPolicy: 'network-only'
    })

    if (!order) return null

    const requests = orderRequestData ? orderRequestData.orderRequests : []

    return (
        <Padding disableInMobile>
            <View>
                <div className="title">{order.title}</div>
                {order.image && <img className="image" src={`${host}/uploads/${order.image}`} />}
                <div className="description">{order.description}</div>
                <NameValue label="Цена" value={order.price} />
                <NameValue label="Статус" value={getStatus(order.status)} />
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
            {!order.freelancer ? (
                <View style={{ marginBottom: 15 }}>
                    <div className="title">Отклики</div>
                    {orderRequestLoading || typeof window === 'undefined' ? (
                        <Spinner />
                    ) : requests.filter((item) => item.status === 'NEW').length === 0 ? (
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
                                        <RequestActions item={item} />
                                    </div>
                                    {item.comment && <div className="comment">{item.comment}</div>}
                                    <div className="created">
                                        {moment(item.created).format('DD.MM.YYYY HH:mm')}
                                    </div>
                                </Request>
                            ))
                    )}
                </View>
            ) : (
                <View style={{ marginBottom: 15 }}>
                    <div className="title">Исполнитель</div>
                    <NameValue label="Имя" value={order.freelancer.name} />
                    <NameValue last label="Email" value={order.freelancer.email} />
                    {order.status === 'ACCEPT_WAITING' && <Accepting order={order} />}
                </View>
            )}
        </Padding>
    )
}

const Accepting = ({ order }) => {
    const [confirmFinishOrder] = useMutation(CONFIRM_FINISH_ORDER, {
        onCompleted: () => Router.reload()
    })
    const [cancelFinishOrder] = useMutation(CANCEL_FINISH_ORDER, {
        onCompleted: () => Router.reload()
    })

    const handleConfirm = () => {
        if (confirm('Принять работу?')) {
            confirmFinishOrder({
                variables: {
                    where: { _id: order._id }
                }
            })
        }
    }

    const handleCancel = () => {
        if (confirm('Отклонить работу?')) {
            cancelFinishOrder({
                variables: {
                    where: { _id: order._id }
                }
            })
        }
    }

    return (
        <>
            <div style={{ color: 'gray', fontWeight: 400, marginTop: 20, marginBottom: 15 }}>
                Исполнитель отправил работу на проверку. Требуется принять или отклонить его
            </div>
            <AcceptingActions>
                <Button onClick={handleConfirm} className="accept">
                    Принять
                </Button>
                <Button onClick={handleCancel} className="cancel">
                    Отклонить
                </Button>
            </AcceptingActions>
        </>
    )
}

const RequestActions = ({ item }) => {
    const [acceptRequest, { loading: accepting }] = useMutation(ACCEPT_REQUEST, {
        onCompleted: () => {
            Router.reload()
        }
    })
    const [deniedRequest, { loading: denieding }] = useMutation(DENIED_REQUEST, {
        update: (cache, { data }) => {
            if (data && data.deniedRequest) {
                const { orderRequests } = cache.readQuery({
                    query: GET_ORDER_REQUESTS,
                    variables: { where: { _id: item.order._id } }
                })
                cache.writeQuery({
                    query: GET_ORDER_REQUESTS,
                    data: {
                        orderRequests: orderRequests.filter(
                            (item) => item._id !== data.deniedRequest._id
                        )
                    }
                })
            }
        }
    })

    const handleAcceptRequest = (_id) => {
        acceptRequest({
            variables: { where: { _id } }
        })
    }

    const handleDeniedRequest = (_id) => {
        deniedRequest({
            variables: { where: { _id } }
        })
    }

    return (
        <div className="actions">
            <Button
                onClick={() => {
                    if (confirm('Точно принять?')) {
                        handleAcceptRequest(item._id)
                    }
                }}
                className="accept"
                loading={accepting}
            >
                Принять
            </Button>
            <Button
                onClick={() => {
                    if (confirm('Точно отклонить?')) {
                        handleDeniedRequest(item._id)
                    }
                }}
                className="denied"
                loading={denieding}
            >
                Отклонить
            </Button>
        </div>
    )
}

Order.getInitialProps = async ({ query, apolloClient }) => {
    const { id } = query
    const { data: orderData } = await apolloClient.query({
        query: GET_ORDER,
        variables: {
            where: { _id: id }
        }
    })
    const order = orderData ? orderData.order : null
    return { order }
}

const getStatus = (status) => {
    if (status === 'NEW') {
        return <span style={{ color: 'blue' }}>Новый</span>
    }
    if (status === 'IN_PROGRESS') {
        return <span style={{ color: 'gray' }}>В работе</span>
    }
    if (status === 'ACCEPT_WAITING') {
        return <span style={{ color: 'orange' }}>Ожидание приемки</span>
    }
    if (status === 'FINISHED') {
        return <span style={{ color: 'green' }}>Выполнен</span>
    }
}

export default Order
