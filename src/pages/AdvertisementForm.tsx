import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'
import { useAdvertiseMutation } from '../hooks/advertisement'
import useStore, { PEER_STATUS } from '../store'
import { getOrGeneratePeerId } from '../utils/peer'
import PrimaryButton from '../components/PrimaryButton'
import ConnectWalletButton from '../components/ConnectWalletButton'
import Title from '../components/Title'
import { FONT_SIZE, RADIUS, SPACE } from '../constants'
import { getFormErrorMessage } from '../errorMessages'
import tokens from '../tokenlist'
import SMPPeer from 'js-smp-peer'

type FormData = {
  currency1: string
  currency2: string
  amount: number
  price: number
}

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

  const fields = watch()
  const store = useStore()

  const advertiseMutation = useAdvertiseMutation()
  const theme = useTheme()
  const { active } = useWeb3React()

  const onSubmit = handleSubmit(async (data) => {
    const peerId = getOrGeneratePeerId()
    setSubmitting(true)
    const res = await advertiseMutation.mutateAsync({ ...data, peerId })
    const receipt = await res.wait()
    if (receipt.status === 1) {
      toast.success('Advertise transaction succeeded!!', { icon: '🥳' })
    } else {
      toast.error('Advertise transaction failed...', { icon: '😥' })
    }
    setSubmitting(false)
    // peer management
    // initialize SMPPeer and set peer to store
    store.setPeerStatus(PEER_STATUS.STARTING)
    const peer = new SMPPeer(data.price.toString(), peerId)
    await peer.connectToPeerServer()
    store.setPeer(peer)
    store.setPeerStatus(PEER_STATUS.RUNNING)
    peer.on('incoming', (remotePeerId: string, result: boolean) => {
      console.log(
        `Incoming SMP finished. peerId: ${remotePeerId}, result: ${result}`
      )
    })
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
              <Label>Amount (From token)</Label>
              <Input
                {...register('amount', {
                  required: true,
                  validate: {
                    positiveNumber: (v) => v > 0
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
              <Label>
                Price ({fields.currency2 || '-'}/{fields.currency1 || '-'})
                (*private field)
              </Label>
              <Input
                {...register('price', {
                  required: true,
                  validate: {
                    positiveNumber: (v) => v > 0
                  }
                })}
                placeholder="0.0"
                error={!!errors.price}
              />
              <ErrorMessage>
                {getFormErrorMessage(errors.price?.type)}
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
  width: 100vw;
  display: flex;
  justify-content: center;
`

const Body = styled.div`
  width: 100%;
  max-width: 600px;
  padding: ${SPACE.XL} ${SPACE.XXL};
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

const SubmitButton = styled(PrimaryButton)`
  font-size: ${FONT_SIZE.M};
  font-weight: 600;
  width: 100%;
  padding: 12px;
`

export default AdvertisementForm
