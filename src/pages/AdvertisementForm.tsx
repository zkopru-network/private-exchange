import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'
import dayjs from 'dayjs'
import { usePostAdvertisement, FormData } from '../hooks/advertisement'
import { useListenSmp } from '../hooks/smp'
import { useTokens } from '../hooks/tokens'
import useZkopruStore from '../store/zkopru'
import PrimaryButton from '../components/PrimaryButton'
import ConnectWalletButton from '../components/ConnectWalletButton'
import Title from '../components/Title'
import { Input, Label, ErrorMessage, FormControl } from '../components/Form'
import { FONT_SIZE, RADIUS, SPACE } from '../constants'
import { getFormErrorMessage } from '../errorMessages'
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
  const tokensQuery = useTokens()
  const { active } = useWeb3React()
  const zkopruStore = useZkopruStore()
  const postAd = usePostAdvertisement()
  const listenSmp = useListenSmp()
  const fields = watch()

  const onSubmit = handleSubmit(async (data) => {
    const zkAddress = useZkopruStore.getState().zkAddress as string

    try {
      setSubmitting(true)
      const res = await postAd({
        ...data,
        advertiser: zkAddress,
        peerId: zkAddress
      })
      if (res.status === 201) {
        const adId = Number(res.data.id)
        toast.success('Advertise transaction succeeded!!', { icon: '🥳' })

        // save db
        if (adId) {
          console.log('saving advertisement...')
          const adRecord = {
            ...data,
            id: adId,
            advertiser: zkAddress,
            exchanged: false
          }
          await AdvertisementEntity.save(adRecord)
          console.log('advertisement saved.')
        }
        setSubmitting(false)
        await listenSmp({ ...data, id: adId, advertiser: zkAddress })
        await HistoryEntity.save({
          ...data,
          historyType: HistoryType.MakeAd,
          timestamp: dayjs().unix(),
          adId
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
  const tokens = tokensQuery.data || []

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
                      }),
                      option: (provided) => ({
                        ...provided,
                        color: theme.onSecondary
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
                      }),
                      option: (provided) => ({
                        ...provided,
                        color: theme.onSecondary
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
                        fields.currency1 === 'ETH'
                          ? (zkopruStore.balance as number)
                          : zkopruStore.tokenBalances[fields.currency1]
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
