import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'
import Modal from 'react-modal'
import dayjs from 'dayjs'
import { usePostAdvertisement, FormData } from '../hooks/advertisement'
import { useListenSmp } from '../hooks/smp'
import { useTokens } from '../hooks/tokens'
import useZkopruStore from '../store/zkopru'
import PrimaryButton from '../components/PrimaryButton'
import ConnectWalletButton from '../components/ConnectWalletButton'
import { Input, Label, ErrorMessage, FormControl } from '../components/Form'
import { PageContainer, PageBody, PageHead, Title } from '../components/Page'
import { FONT_SIZE, RADIUS, SPACE } from '../constants'
import { getFormErrorMessage } from '../errorMessages'
import AdvertisementEntity from '../db/Advertisement'
import HistoryEntity, { HistoryType } from '../db/History'

const AdvertisementForm = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      fee: 2200
    }
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
        setModalOpen(false)
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
        setModalOpen(false)
        return
      }
    } catch (e) {
      console.log(e)
      toast.error('Advertise transaction failed...', { icon: '😥' })
      setSubmitting(false)
      setModalOpen(false)
      return
    }
  })
  const tokens = tokensQuery.data || []
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)'
    },
    content: {
      border: `2px solid ${theme.border}`,
      borderRadius: '8px',
      backgroundColor: theme.surface,
      color: theme.textSub,
      minWidth: '400px',
      minHeight: '300px',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  return (
    <PageContainer>
      <Body>
        <PageHead>
          <Title>Create Advertisement</Title>
          {/* <HeadLink
            onClick={() => {
              window.history.back()
            }}
          >
            &larr; Back
          </HeadLink> */}
        </PageHead>
        <FormContainer>
          <form>
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
                        color: theme.onPrimary
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
                        color: theme.onPrimary
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

            {/* TODO: validate fee */}
            <FormControl>
              <Label>Fee (gwei)</Label>
              <Input
                {...register('fee', {
                  required: true,
                  validate: {
                    positiveNumber: (v) => v > 0
                  }
                })}
                placeholder="0.0"
                error={!!errors.fee}
              />
              <ErrorMessage>
                {getFormErrorMessage(errors.fee?.type)}
              </ErrorMessage>
            </FormControl>

            {!active ? (
              <ConnectWalletButton />
            ) : !isValid ? (
              <SubmitButton disabled>Fill the form</SubmitButton>
            ) : submitting ? (
              <SubmitButton disabled>Submitting...</SubmitButton>
            ) : (
              <SubmitButton
                onClick={(e) => {
                  e.preventDefault()
                  setModalOpen(true)
                }}
              >
                Create Advertisement
              </SubmitButton>
            )}
          </form>
        </FormContainer>
      </Body>
      <Modal isOpen={modalOpen} style={customStyles}>
        <ConfirmContainer>
          <ConfirmTitle>Confirm Advertisement</ConfirmTitle>
          <ConfirmBody>
            <ConfirmItem>
              <ConfirmLabel>From</ConfirmLabel>
              <ConfirmValue>{fields.currency1}</ConfirmValue>
            </ConfirmItem>
            <ConfirmItem>
              <ConfirmLabel>To</ConfirmLabel>
              <ConfirmValue>{fields.currency2}</ConfirmValue>
            </ConfirmItem>
            <ConfirmItem>
              <ConfirmLabel>From amount</ConfirmLabel>
              <ConfirmValue>{fields.amount}</ConfirmValue>
            </ConfirmItem>
            <ConfirmItem>
              <ConfirmLabel>To amount</ConfirmLabel>
              <ConfirmValue>{fields.receiveAmount}</ConfirmValue>
            </ConfirmItem>
          </ConfirmBody>
          <ConfirmButtonSection>
            <ConfirmButton
              onClick={() => {
                setModalOpen(false)
              }}
            >
              Cancel
            </ConfirmButton>
            <ConfirmButton
              onClick={() => {
                onSubmit()
              }}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Confirm'}
            </ConfirmButton>
          </ConfirmButtonSection>
        </ConfirmContainer>
      </Modal>
    </PageContainer>
  )
}

const Body = styled.div`
  width: 100%;
`

const HeadLink = styled.a`
  cursor: pointer;
  font-weight: 600;
`

export const FormContainer = styled(PageBody)`
  margin-top: 40px;
`

const SubmitButton = styled(PrimaryButton)`
  font-size: ${FONT_SIZE.M};
  font-weight: 600;
  width: 100%;
  padding: 12px;
`

const ConfirmContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  min-height: 300px;
`

const ConfirmBody = styled.div``

const ConfirmTitle = styled.h2`
  margin: ${SPACE.M};
`

const ConfirmItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${SPACE.M};
`

const ConfirmLabel = styled.span`
  font-weight: 600;
`

const ConfirmValue = styled.span``

const ConfirmButton = styled(PrimaryButton)`
  width: 160px;
`

const ConfirmButtonSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export default AdvertisementForm
