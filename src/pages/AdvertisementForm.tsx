import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'
import dayjs from 'dayjs'
import { useAdvertiseMutation, FormData } from '../hooks/advertisement'
import { useListenSmp } from '../hooks/smp'
import useZkopruStore from '../store/zkopru'
import PrimaryButton from '../components/PrimaryButton'
import ConnectWalletButton from '../components/ConnectWalletButton'
import Title from '../components/Title'
import { Input, Label, ErrorMessage, FormControl } from '../components/Form'
import { FONT_SIZE, RADIUS, SPACE } from '../constants'
import { getFormErrorMessage } from '../errorMessages'
import tokens from '../tokenlist'
import AdvertisementEntity from '../db/Advertisement'
import HistoryEntity, { HistoryType } from '../db/History'

const AdvertisementForm = () => {
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: 'onChange'
  })

  const theme = useTheme()
  const { active } = useWeb3React()
  const zkopruStore = useZkopruStore()
  const advertiseMutation = useAdvertiseMutation()
  const listenSmp = useListenSmp()
  const fields = watch()

  const onSubmit = handleSubmit(async (data) => {
    const peerId = useZkopruStore.getState().zkAddress as string

    try {
      setSubmitting(true)
      const res = await advertiseMutation.mutateAsync({
        ...data,
        peerId
      })
      const receipt = await res.wait()
      if (receipt.status === 1) {
        const adId = receipt.events?.[0].args?.[0].toNumber()
        toast.success('Advertise transaction succeeded!!', { icon: '🥳' })

        // save db
        if (adId) {
          console.log('saving advertisement...')
          await AdvertisementEntity.save({
            ...data,
            adId,
            exchanged: false
          })
          console.log('advertisement saved.')
        }
        setSubmitting(false)
        await listenSmp({ ...data, adId })
        await HistoryEntity.save({
          historyType: HistoryType.MakeAd,
          timestamp: dayjs().unix(),
          adId,
          ...data
        })
      } else {
        toast.error('Advertise transaction failed...', { icon: '😥' })
        setSubmitting(false)
        return
      }
    } catch (e) {
      console.log(e)
      toast.error('Advertise transaction failed...', { icon: '😥' })
      setSubmitting(false)
      return
    }
  })

  return (
    <Container>
      <Body>
        <PageHead>
          <Title>Create Advertisement</Title>
          <HeadLink
            onClick={() => {
              window.history.back()
            }}
          >
            &larr; Back
          </HeadLink>
        </PageHead>
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
                rules={{ required: true }}
              />
              <ErrorMessage>
                {getFormErrorMessage(errors.currency1?.type)}
              </ErrorMessage>
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
                rules={{ required: true }}
              />

              <ErrorMessage>
                {getFormErrorMessage(errors.currency2?.type)}
              </ErrorMessage>
            </FormControl>

            <FormControl>
              <Label>Amount (Send token)</Label>
              <Input
                {...register('amount', {
                  required: true,
                  validate: {
                    positiveNumber: (v) => v > 0,
                    exceedBalance: (v) => {
                      const balance =
                        zkopruStore.tokenBalances[fields.currency1]
                      return zkopruStore.l2BalanceLoaded && balance >= v
                    }
                  }
                })}
                placeholder="0.0"
                error={!!errors.amount}
              />
              <ErrorMessage>
                {getFormErrorMessage(errors.amount?.type)}
              </ErrorMessage>
            </FormControl>

            <FormControl>
              <Label>Amount (Receive token)</Label>
              <Input
                {...register('receiveAmount', {
                  required: true,
                  validate: {
                    positiveNumber: (v) => v > 0
                  }
                })}
                placeholder="0.0"
                error={!!errors.receiveAmount}
              />
              <ErrorMessage>
                {getFormErrorMessage(errors.receiveAmount?.type)}
              </ErrorMessage>
            </FormControl>

            {!active ? (
              <ConnectWalletButton />
            ) : !isValid ? (
              <SubmitButton disabled>Fill the form</SubmitButton>
            ) : submitting ? (
              <SubmitButton disabled>Submitting...</SubmitButton>
            ) : (
              <SubmitButton>Create Advertisement</SubmitButton>
            )}
          </form>
        </FormContainer>
      </Body>
    </Container>
  )
}

const Container = styled.div`
  padding: ${SPACE.XL} ${SPACE.XXL};
`

const Body = styled.div`
  width: 100%;
`

const PageHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeadLink = styled.a`
  cursor: pointer;
  font-weight: 600;
`
export const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.onSurface};
  box-shadow: 0 1px 4px ${({ theme }) => theme.shadow};
  border-radius: ${RADIUS.M};
  padding: ${SPACE.M};
`

const SubmitButton = styled(PrimaryButton)`
  font-size: ${FONT_SIZE.M};
  font-weight: 600;
  width: 100%;
  padding: 12px;
`

export default AdvertisementForm
