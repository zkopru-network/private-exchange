import React from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  currency1: string
  currency2: string
  buyOrSell: boolean // if buy buy currency1 with currency2, otherwise vice versa
  amount: number
}

const AdvertisementForm = () => {
  const { register, handleSubmit } = useForm<FormData>()

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <div>
      <form onSubmit={onSubmit}></form>
    </div>
  )
}

export default AdvertisementForm
