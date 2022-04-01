import React from 'react'
import Modal from 'react-modal'
import styled, { useTheme } from 'styled-components'
import { FONT_SIZE } from '../constants'
import LoadingSpinner from '../assets/Loading.svg'
import PrimaryButton from './PrimaryButton'

export enum SwapStatus {
  INITIAL,
  SMP_RUNNING,
  SMP_FAIL,
  SMP_SUCCESS,
  TX_SUBMITTED,
  TX_FAIL
}

type Props = {
  swapStatus: SwapStatus
  onClose: () => void
}

const SwapModal = ({ swapStatus, onClose }: Props) => {
  const theme = useTheme()

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
    <Modal isOpen={swapStatus !== SwapStatus.INITIAL} style={customStyles}>
      <ModalContainer>
        {swapStatus === SwapStatus.SMP_RUNNING ? (
          <ModalInner>
            <ModalLabel>SMP Running</ModalLabel>
            <img src={LoadingSpinner} alt="loading" />
          </ModalInner>
        ) : swapStatus === SwapStatus.SMP_FAIL ? (
          <ModalInner>
            <ModalLabel>Match Failed</ModalLabel>
            <ModalButton onClick={onClose}>Close</ModalButton>
          </ModalInner>
        ) : swapStatus === SwapStatus.SMP_SUCCESS ? (
          <ModalInner>
            <ModalLabel>Match Succeed</ModalLabel>
            <ModalText>Creating Transaction</ModalText>
            <img src={LoadingSpinner} alt="loading" />
          </ModalInner>
        ) : swapStatus === SwapStatus.TX_FAIL ? (
          <ModalInner>
            <ModalLabel>Transaction Failed</ModalLabel>
            <ModalButton onClick={onClose}>Close</ModalButton>
          </ModalInner>
        ) : swapStatus === SwapStatus.TX_SUBMITTED ? (
          <ModalInner>
            <ModalLabel>Transaction Submitted</ModalLabel>
            <ModalButton onClick={onClose}>Close</ModalButton>
          </ModalInner>
        ) : (
          ''
        )}
      </ModalContainer>
    </Modal>
  )
}

const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
`

const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ModalLabel = styled.p`
  font-weight: 400;
  font-size: ${FONT_SIZE.XL};
`

const ModalText = styled.p`
  margin: 0;
`

const ModalButton = styled(PrimaryButton)`
  width: 160px;
`

export default SwapModal
