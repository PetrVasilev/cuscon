import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import Link from 'next/link'

const View = styled.div`
    background: white;
    padding: 16px 20px;
    border: 1px solid #dedede;
    margin-bottom: 15px;
    max-width: 700px;
    cursor: pointer;
    transition: 0.3s border;

    &:hover {
        border: 1px solid silver;
    }

    @media only screen and (max-width: 400px) {
        padding: 15px;
    }

    .title {
        font-size: 16px;
        color: #359681;
        margin-bottom: 10px;
        font-weight: 400;
    }

    .description {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        color: black;
    }

    .created {
        margin-top: 10px;
    }
`

const Order = ({ order }) => {
    return (
        <Link href={`/orders/[id]`} as={`/orders/${order._id}`}>
            <View>
                <div className="title">{order.title}</div>
                <div className="description">{order.description}</div>
                <div className="created">{moment(order.created).format('DD.MM.YYYY HH:mm')}</div>
            </View>
        </Link>
    )
}

export default Order
