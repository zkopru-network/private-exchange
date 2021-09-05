import React from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAdvertiseMutation } from '../hooks/advertisement'
import PrimaryButton from '../components/PrimaryButton'
import { FONT_SIZE, RADIUS, SPACE } from '../constants'
import tokens from '../tokenlist'
import { useState } from 'react'

type FormData = {
  currency1: string
  currency2: string
  amount: number
}

const AdvertisementForm = () => {
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur'
  })

  const advertiseMutation = useAdvertiseMutation()

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true)
    const res = await advertiseMutation.mutateAsync(data)
    const receipt = await res.wait()
    if (receipt.status === 1) {
      toast.success('Advertise transaction succeeded!!', { icon: '🥳' })
    } else {
      toast.error('Advertise transaction failed...', { icon: '😥' })
    }
    setSubmitting(false)
  })

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <FormControl>
          <Label>Currency 1</Label>
          {/* TODO: use token select dropdown */}
          <Input
            {...register('currency1', {
              required: 'This field is required',
              validate: {
                tokenExist: (value) =>
                  tokens.findIndex((v) => v.symbol === value) !== -1 ||
                  'Invalid token'
              }
            })}
            error={!!errors.currency1}
          />
          <ErrorMessage>{errors.currency1?.message || ''}</ErrorMessage>
        </FormControl>

        <FormControl>
          <Label>Currency 2</Label>
          {/* TODO: use token select dropdown */}
          <Input
            {...register('currency2', {
              required: 'This field is required',
              validate: {
                tokenExist: (value) =>
                  tokens.findIndex((v) => v.symbol === value) !== -1 ||
                  'Invalid token'
              }
            })}
            error={!!errors.currency2}
          />
          <ErrorMessage>{errors.currency2?.message || ''}</ErrorMessage>
        </FormControl>

        <FormControl>
          <Label>Amount</Label>
          <Input
            {...register('amount', { required: 'This field is required' })}
            placeholder="0.0"
            error={!!errors.amount}
          />
          <ErrorMessage>{errors.amount?.message || ''}</ErrorMessage>
        </FormControl>

        {submitting ? (
          <PrimaryButton disabled>Submitting...</PrimaryButton>
        ) : (
          <PrimaryButton>Create Advertisement</PrimaryButton>
        )}
      </form>
    </Container>
  )
}

const Container = styled.div`
  padding: 20px 40px;
`

const FormControl = styled.div`
  width: 100%;
  margin: ${SPACE.M} 0px;
`

const Input = styled.input<{ error?: boolean }>`
  font-size: ${FONT_SIZE.L};
  padding: ${SPACE.XS} ${SPACE.S};
  border-radius: ${RADIUS.M};
  border: solid 1px ${({ theme }) => theme.border};
  ${({ error, theme }) => (error ? `border-color: ${theme.error}` : '')};
`

const Label = styled.label`
  display: block;
  font-size: ${FONT_SIZE.S};
  color: ${({ theme }) => theme.onBackground};
  margin-bottom: ${SPACE.XS};
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  font-size: ${FONT_SIZE.S};
  height: 12px;
`

export default AdvertisementForm
