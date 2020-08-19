import React, { useState } from 'react'
import styled from 'styled-components'
import { useMutation } from '@apollo/client'
import InputMask from 'react-input-mask'
import Router from 'next/router'
import moment from 'moment'

import Input from '../../components/Input'
import Button from '../../components/Button'
import Textarea from '../../components/Textarea'
import FileInput from '../../components/FileInput'
import { CREATE_ORDER, GET_ORDERS } from '../../gqls/order'

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

const CreateOrder = () => {
    const [error, setError] = useState(null)

    const [createOrder, { loading }] = useMutation(CREATE_ORDER, {
        onCompleted: () => {
            Router.push('/')
        },
        onError: (err) => {
            console.error(err)
            setError('Не удалось создать заказ. Попробуйте еще раз')
        },
        update: (cache, { data }) => {
            if (data && data.createOrder) {
                try {
                    const { orders } = cache.readQuery({
                        query: GET_ORDERS,
                        variables: {
                            where: { status: 'NEW' }
                        }
                    })
                    cache.writeQuery({
                        query: GET_ORDERS,
                        variables: {
                            where: { status: 'NEW' }
                        },
                        data: {
                            orders: [data.createOrder, ...orders]
                        }
                    })
                } catch (err) {}
            }
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const title = e.target.title.value
        const description = e.target.description.value
        const price = e.target.price.value
        const deadline = e.target.deadline.value ? e.target.deadline.value : undefined
        const image = e.target.image.files ? e.target.image.files[0] : undefined
        let deadlineDate
        if (deadline) {
            deadlineDate = moment(deadline, 'DD.MM.YYYY')
            if (!deadlineDate.isValid()) {
                return setError('Введите правильную дату срока')
            }
        }
        const data = {
            title,
            description,
            price,
            deadline: deadlineDate,
            image
        }
        createOrder({
            variables: { data }
        })
    }

    return (
        <View>
            <div className="title">Создать заказ</div>
            <Form onSubmit={handleSubmit}>
                <Input label="Заголовок" name="title" required />
                <Textarea label="Описание" name="description" required />
                <Input label="Цена" name="price" required />
                <InputMask mask="99.99.9999">
                    {(inputProps) => <Input label="Срок" name="deadline" {...inputProps} />}
                </InputMask>
                <FileInput name="image" label="Изображение" accept="image/*" />
                {error && <div className="error">{error}</div>}
                <div className="actions">
                    <Button loading={loading} type="submit">
                        Создать
                    </Button>
                </div>
            </Form>
        </View>
    )
}

export default CreateOrder
