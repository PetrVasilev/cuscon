import React, { useState } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { useMutation, useQuery } from '@apollo/client'

import { GET_ORDER } from '../../gqls/order'
import { CREATE_REQUEST, GET_USER_REQUESTS } from '../../gqls/request'
import Padding from '../../components/Padding'
import Textarea from '../../components/Textarea'
import NameValue from '../../components/NameValue'
import Button from '../../components/Button'
import { host } from '../../utils/apollo/client'
import { useUser } from '../../utils/hooks'

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
`

const Order = ({ order }) => {
    const [sent, setSent] = useState(false)
    const [error, setError] = useState(null)

    const { user } = useUser()

    const { data: userRequestsData } = useQuery(GET_USER_REQUESTS)
    const [createRequest, { loading: creatingReq }] = useMutation(CREATE_REQUEST, {
        onCompleted: () => {
            setSent(true)
        },
        onError: (err) => {
            console.error(err)
            setError('Не удалось откликнуться. Попробуйте еще раз')
        },
        update: (cache, { data }) => {
            if (data && data.createRequest) {
                const { userRequests } = cache.readQuery({
                    query: GET_USER_REQUESTS
                })
                cache.writeQuery({
                    query: GET_USER_REQUESTS,
                    data: {
                        userRequests: [...userRequests, data.createRequest]
                    }
                })
            }
        }
    })

    if (!order) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        const comment = e.target.comment.value
        const data = { comment }
        setError(null)
        createRequest({ variables: { where: { _id: order._id }, data } })
    }

    const userRequests = userRequestsData ? userRequestsData.userRequests : []
    const userDidRequest = userRequests.find((item) => item.order._id === order._id)

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
                />
                {order.deadline && (
                    <NameValue label="Срок" value={moment(order.deadline).format('DD.MM.YYYY')} />
                )}
                <NameValue last label="Заказчик" value={order.creator.name} />
            </View>
            {user && (
                <View style={{ marginBottom: 15 }}>
                    <div style={{ marginBottom: 12 }} className="title">
                        Откликнуться
                    </div>
                    {sent || userDidRequest ? (
                        <div className="success">Вы откликнулись на заказ</div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Textarea name="comment" label="Комментарий" />
                            {error && <div className="error">{error}</div>}
                            <Button loading={creatingReq} type="submit">
                                Отправить
                            </Button>
                        </form>
                    )}
                </View>
            )}
        </Padding>
    )
}

Order.getInitialProps = async ({ query, apolloClient }) => {
    const { id } = query
    const { data } = await apolloClient.query({
        query: GET_ORDER,
        variables: {
            where: { _id: id }
        }
    })
    const order = data ? data.order : null
    return { order }
}

export default Order
