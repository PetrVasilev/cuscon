import React from 'react'
import styled from 'styled-components'
import Router from 'next/router'
import { useQuery } from '@apollo/client'

import Padding from '../components/Padding'
import Button from '../components/Button'
import Order from '../components/Order'
import { GET_ORDERS } from '../gqls/order'
import { useUser } from '../utils/hooks'

const View = styled.div`
    margin-top: 15px;

    .top {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        @media only screen and (max-width: 350px) {
            flex-direction: column;
            align-items: flex-start;
        }
    }

    .no-data {
        font-size: 16px;
        text-align: center;
        color: gray;
        margin-top: 20px;
    }

    .list {
        margin-top: 15px;
    }
`

const Title = styled.div`
    font-size: 18px;
    font-weight: 400;

    @media only screen and (max-width: 350px) {
        margin-bottom: 12px;
    }
`

const Main = () => {
    const { user } = useUser()

    const { data } = useQuery(GET_ORDERS, {
        variables: { where: { status: 'NEW' } }
    })

    const orders = data ? data.orders : []

    return (
        <Padding>
            <View>
                <div className="top">
                    <Title>Доступные заказы</Title>
                    <Button
                        onClick={() => {
                            if (user) {
                                Router.push('/orders/create')
                            } else {
                                Router.push('/login')
                            }
                        }}
                    >
                        Создать заказ
                    </Button>
                </div>
                {orders.length === 0 ? (
                    <div className="no-data">Заказов пока нет</div>
                ) : (
                    <div className="list">
                        {orders.map((item) => (
                            <Order key={item._id} order={item} />
                        ))}
                    </div>
                )}
            </View>
        </Padding>
    )
}

export default Main
