import React, { useState } from 'react'
import styled from 'styled-components'
import { useRoute } from 'wouter'
import toast from 'react-hot-toast'
import { useWeb3React } from '@web3-react/core'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import Title from '../components/Title'
import {
  Input,
  Label,
  FormControl,
  ErrorMessage,
  FormValue
} from '../components/Form'
import PrimaryButton from '../components/PrimaryButton'
import ConnectWalletButton from '../components/ConnectWalletButton'
import { PageContainer, PageBody, PageHead } from '../components/Page'
import { useAdvertisementQuery, Advertisement } from '../hooks/advertisement'
import useZkopruStore from '../store/zkopru'
import { useRunSmp } from '../hooks/smp'
import { useSwap } from '../hooks/swap'
import { FONT_SIZE, SPACE } from '../constants'
import { toScaled, pow10, toUnscaled } from '../utils/bn'
import { shortAddressString } from '../utils/string'
import HistoryEntity, { HistoryType } from '../db/History'
import { getFormErrorMessage } from '../errorMessages'
import { useTokensMap } from '../hooks/tokens'

const Exchange = () => {
  // extract url params. always match path.
  const params = useRoute('/exchange/:id')[1]
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<{
    sendAmount: number
    receiveAmount: number
  }>({
    mode: 'onChange'
  })
  const { active } = useWeb3React()
  const [submitting, setSubmitting] = useState(false)
  const id: string = (params as any).id
  const zkopruStore = useZkopruStore()
  const ad = useAdvertisementQuery(id)
  const smpMutation = useRunSmp()
  const swapMutation = useSwap()
  const tokensMapQuery = useTokensMap()

  const runSMP = handleSubmit(async ({ sendAmount, receiveAmount }) => {
    const advertisement = ad?.data
    if (!advertisement) {
      console.error('ad not loaded.')
      return
    }
    const tokens = tokensMapQuery.data
    if (!tokens) {
      console.error('tokens map not loaded')
      return
    }
    setSubmitting(true)

    toast('Starting smp....')
    const counterParty = advertisement.peerId
    const [currency1, currency2] = advertisement.pair.split('/')
    const buyOrSell = advertisement.buyOrSell
    const sendTokenSymbol = buyOrSell ? currency1 : currency2
    const receiveTokenSymbol = buyOrSell ? currency2 : currency1
    const sendToken = tokens[sendTokenSymbol].address
    const receiveToken = tokens[receiveTokenSymbol].address
    const sendDecimals = tokens[sendTokenSymbol].decimals
    const receiveDecimals = tokens[receiveTokenSymbol].decimals

    const price = toScaled(sendAmount, sendDecimals)
      .mul(pow10(receiveDecimals))
      .div(toScaled(receiveAmount, receiveDecimals))

    const smpResult = await smpMutation.mutateAsync({
      price: price.toString(),
      counterpartyId: counterParty,
      amount: receiveAmount
    })
    toast(
      `Finish running smp. Result: ${
        smpResult.result ? 'Success' : 'Failed'
      }: Amount: ${smpResult.negotiatedAmount}`
    )

    if (smpResult.result) {
      try {
        const receive = toScaled(smpResult.negotiatedAmount, receiveDecimals)
        const send = price.mul(receive).div(pow10(receiveDecimals))
        toast(
          `Creating swap transaction. send ${sendTokenSymbol}: ${send.toString()}, receive ${receiveTokenSymbol}: ${receive.toString()}`
        )
        console.log(
          'swap with, sendToken, receiveToken, sendAmount, receiveAmount',
          counterParty,
          sendToken,
          receiveToken,
          send.toString(),
          receive.toString()
        )

        await swapMutation.mutateAsync({
          counterParty,
          sendToken,
          receiveToken,
          receiveAmount: receive,
          sendAmount: send
        })
        toast.success('Successfully created swap transaction.')
        await HistoryEntity.save({
          historyType: HistoryType.MatchMade,
          timestamp: dayjs().unix(),
          adId: Number(id),
          currency1: sendTokenSymbol,
          currency2: receiveTokenSymbol,
          amount: toUnscaled(send, sendDecimals),
          receiveAmount: toUnscaled(receive, receiveDecimals),
          pending: true
        })
      } catch (e) {
        toast.error('Failed to create swap transaction.')
      }
    } else {
      await HistoryEntity.save({
        historyType: HistoryType.MatchFailed,
        timestamp: dayjs().unix(),
        adId: Number(id),
        currency1: sendTokenSymbol,
        currency2: receiveTokenSymbol,
        amount: sendAmount,
        receiveAmount: receiveAmount
      })
    }
    setSubmitting(false)
  })

  if (ad.isLoading && !ad.data) {
    return (
      <PageContainer>
        <PageHead>
          <Title>Exchange</Title>
        </PageHead>
        <PageBody>Loading...</PageBody>
      </PageContainer>
    )
  }

  const advertisement: Advertisement = ad.data as any
  const [currency1, currency2] = advertisement.pair.split('/')

  return (
    <PageContainer>
      <PageHead>
        <Title>Exchange</Title>
        <HeadLink
          onClick={() => {
            window.history.back()
          }}
        >
          &larr; Back
        </HeadLink>
      </PageHead>
      <PageBody>
        <FormControl>
          <Label>PeerID</Label>
          <FormValue>
            {shortAddressString(advertisement.peerId.toString())}
          </FormValue>
        </FormControl>
        <FormControl>
          <Label>Pair</Label>
          <FormValue>{advertisement.pair.toString()}</FormValue>
        </FormControl>
        <FormControl>
          <Label>From</Label>
          <FormValue>
            {advertisement.buyOrSell ? currency1 : currency2}
          </FormValue>
          <Label>To</Label>
          <FormValue>
            {advertisement.buyOrSell ? currency2 : currency1}
          </FormValue>
        </FormControl>
        <FormControl>
          <Label>
            Amount Receive({advertisement.buyOrSell ? currency2 : currency1})
            <FootNote>(Max: {advertisement.amount})</FootNote>
          </Label>
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
        <FormControl>
          <Label>
            Amount Send({advertisement.buyOrSell ? currency1 : currency2})
          </Label>
          <Input
            {...register('sendAmount', {
              required: true,
              validate: {
                positiveNumber: (v) => v > 0,
                exceedBalance: (v) => {
                  const currency = advertisement.buyOrSell
                    ? currency1
                    : currency2
                  const balance =
                    currency === 'ETH'
                      ? zkopruStore.balance
                      : zkopruStore.tokenBalances[
                          advertisement.buyOrSell ? currency1 : currency2
                        ]
                  return !!balance && balance >= v
                }
              }
            })}
            placeholder="0.0"
            error={!!errors.sendAmount}
          />
          <ErrorMessage>
            {getFormErrorMessage(errors.sendAmount?.type)}
          </ErrorMessage>
        </FormControl>

        {!active ? (
          <ConnectWalletButton />
        ) : !isValid ? (
          <SubmitButton disabled>Fill the form</SubmitButton>
        ) : submitting ? (
          <SubmitButton disabled>Submitting...</SubmitButton>
        ) : (
          <SubmitButton onClick={runSMP}>Swap</SubmitButton>
        )}
      </PageBody>
    </PageContainer>
  )
}

const HeadLink = styled.a`
  cursor: pointer;
  font-weight: 600;
`

const FootNote = styled.span`
  margin-left: ${SPACE.S};
  font-size: ${FONT_SIZE.S};
  font-weight: 500;
`

const SubmitButton = styled(PrimaryButton)`
  font-size: ${FONT_SIZE.M};
  font-weight: 600;
  width: 100%;
  padding: 12px;
`

export default Exchange
