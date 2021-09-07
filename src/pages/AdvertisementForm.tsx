import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'
import { useAdvertiseMutation } from '../hooks/advertisement'
import PrimaryButton from '../components/PrimaryButton'
import Title from '../components/Title'
import { FONT_SIZE, RADIUS, SPACE } from '../constants'
import tokens from '../tokenlist'

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
    control,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur'
  })

  const advertiseMutation = useAdvertiseMutation()
  const theme = useTheme()

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
      <Title>Create Advertisement</Title>
      <FormContainer>
        <form onSubmit={onSubmit}>
          <FormControl>
            <Label>From token</Label>
            <Controller
              name="currency1"
              control={control}
              render={({ field: { onChange, onBlur } }) => (
                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: RADIUS.M,
                      borderColor: !!errors.currency1
                        ? theme.error
                        : theme.border
                    })
                  }}
                  options={tokens.map((token) => ({
                    label: token.symbol,
                    value: token.symbol
                  }))}
                  onChange={(token) => {
                    if (!token) return
                    onChange(token.value)
                  }}
                  onBlur={onBlur}
                />
              )}
              rules={{ required: 'This field is required' }}
            />
            <ErrorMessage>{errors.currency1?.message || ''}</ErrorMessage>
          </FormControl>

          <FormControl>
            <Label>To token</Label>
            <Controller
              name="currency2"
              control={control}
              render={({ field: { onChange, onBlur } }) => (
                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderRadius: RADIUS.M,
                      borderColor: !!errors.currency2
                        ? theme.error
                        : theme.border
                    })
                  }}
                  options={tokens.map((token) => ({
                    label: token.symbol,
                    value: token.symbol
                  }))}
                  onChange={(token) => {
                    if (!token) return
                    onChange(token.value)
                  }}
                  onBlur={onBlur}
                />
              )}
              rules={{ required: 'This field is required' }}
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

          {/* TODO: if not connected, button should be connect wallet */}
          {submitting ? (
            <PrimaryButton disabled>Submitting...</PrimaryButton>
          ) : (
            <PrimaryButton>Create Advertisement</PrimaryButton>
          )}
        </form>
      </FormContainer>
    </Container>
  )
}

const Container = styled.div`
  padding: ${SPACE.XL} ${SPACE.XXL};
`

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  box-shadow: 0 1px 4px ${({ theme }) => theme.shadow};
  border-radius: ${RADIUS.M};
  padding: ${SPACE.M};
`

const FormControl = styled.div`
  width: 100%;
  margin: ${SPACE.M} 0px;

  &:first-child {
    margin-top: 0;
  }
`

const Input = styled.input<{ error?: boolean }>`
  font-size: ${FONT_SIZE.L};
  padding: ${SPACE.XS} ${SPACE.S};
  border-radius: ${RADIUS.M};
  border: solid 1px ${({ theme }) => theme.border};
  ${({ error, theme }) => (error ? `border-color: ${theme.error}` : '')};
  width: 100%;
`

const Label = styled.label`
  display: block;
  font-size: ${FONT_SIZE.S};
  font-weight: 600;
  color: ${({ theme }) => theme.onBackground};
  margin-bottom: ${SPACE.XS};
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  font-size: ${FONT_SIZE.S};
  height: 12px;
`

export default AdvertisementForm
