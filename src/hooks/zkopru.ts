import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useWeb3React } from '@web3-react/core'
import { sha512_256 } from 'js-sha512'
import { fromWei } from '../utils/wei'
import { padAddress } from '../utils/string'

// @ts-ignore: no declaration file
import Zkopru, { ZkAccount, UtxoStatus } from '@zkopru/client/browser'
import useStore, { Status } from '../store/zkopru'

export enum NetworkStatus {
  STOPPED = 'stopped',
  ON_SYNCING = 'on syncing',
  ON_FETCHED = 'onFetched',
  ON_PROCESSING = 'processing',
  SYNCED = 'synced',
  FULLY_SYNCED = 'fully synced',
  ON_ERROR = 'on error'
}

const URL = 'ws://localhost:8546'

export function useStartSync() {
  const { account } = useWeb3React()
  const store = useStore()
  const loadWalletKey = useLoadWalletKey()
  const loadWallet = useLoadWallet()
  const updateStatusMutation = useUpdateStatus()

  async function updateStatus() {
    await updateStatusMutation.mutateAsync()
  }

  useEffect(() => {
    if (!store.client && account) {
      ;(async () => {
        await loadWalletKey.mutateAsync()
        const walletKey = useStore.getState().walletKey

        // create and set zkopru node
        const client = Zkopru.Node({
          websocket: URL,
          accounts: [new ZkAccount(walletKey)]
        })
        useStore.setState({ client, syncing: true, status: Status.PREPARING })

        await client.initNode()
        await loadWallet.mutateAsync()
        await client.start()

        // subscribe events
        client.node.synchronizer.on('onFetched', updateStatus)
        client.node.synchronizer.on('status', updateStatus)
        client.node.blockProcessor.on('processed', updateStatus)
      })()

      return () => {
        const client = store.client
        if (client) {
          client.node?.synchronizer.off('onFetched', updateStatus)
          client.node?.synchronizer.off('status', updateStatus)
          client.node?.blockProcessor.off('processed', updateStatus)
        }
      }
    }
  }, [account])
}

export function useLoadWalletKey() {
  const { walletKey } = useStore()
  const { account } = useWeb3React()

  return useMutation(async () => {
    if (!account) throw new Error('Account not set. please connect wallet')
    // wallet key is already set
    if (walletKey) return

    const msgParams = JSON.stringify({
      domain: {
        chainId: 5,
        name: 'Zkopru Testnet',
        version: '0'
      },
      message: {
        info: 'Unlock Zkopru wallet',
        warning:
          'This signature is your private key, only sign on official Zkopru websites!'
      },
      primaryType: 'ZkopruKey',
      types: {
        ZkopruKey: [
          { name: 'info', type: 'string' },
          { name: 'warning', type: 'string' }
        ]
      }
    })
    const signedData = await (window as any).ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [account, msgParams]
    })
    const newKey = sha512_256(signedData)
    useStore.setState({ walletKey: newKey })
  })
}

export function useLoadWallet() {
  const { setZkAddress } = useStore()
  const loadL2Balance = useLoadL2Balance()

  return useMutation(async () => {
    const { client, walletKey } = useStore.getState()
    if (!client || !walletKey) throw new Error('client or walletKey not set.')
    // load wallet
    const wallet = new Zkopru.Wallet(client, walletKey)
    useStore.setState({ wallet })
    const { address } = wallet.wallet.account.zkAddress
    setZkAddress(address)
    await loadL2Balance.mutateAsync()
  })
}

export function useUpdateStatus() {
  const loadL2Balance = useLoadL2Balance()

  return useMutation(async () => {
    const { client } = useStore.getState()
    if (!client?.node) throw new Error('Zkopru client is not initialized.')

    const { status } = client.node?.synchronizer
    if (status === NetworkStatus.ON_SYNCING) {
      useStore.setState({ status: Status.CHECKING_VALIDITY })
    } else if (status === NetworkStatus.FULLY_SYNCED) {
      useStore.setState({ status: Status.FULLY_SYNCED })
    }

    const highestProposal = await client.node.db.findOne('Proposal', {
      where: {},
      orderBy: { proposalNum: 'desc' }
    })
    const uncleCount = await client.node.db.count('Proposal', {
      isUncle: true
    })
    useStore.setState({
      proposalCount: highestProposal ? highestProposal.proposalNum : 0,
      uncleCount
    })

    const latestBlockHash = await client.node.layer2.latestBlock()
    const latestBlock = await client.node.layer2.getProposal(latestBlockHash)
    if (!latestBlock) throw new Error(`Unable to find hash: ${latestBlockHash}`)
    if (typeof latestBlock.canonicalNum !== 'number') {
      throw new Error('Latest block does not include canonical number')
    }
    useStore.setState({ latestBlock: latestBlock.canonicalNum })

    loadL2Balance.mutateAsync()

    const state = useStore.getState()

    // TODO: update history if any pending tx

    if (state.latestBlock > 0) {
      const newPercent =
        (100 * +state.latestBlock) / (+state.proposalCount - state.uncleCount)
      useStore.setState({ syncPercent: newPercent })
    } else {
      state.syncPercent = 100
    }
  })
}

export function useLoadL2Balance() {
  return useMutation(async () => {
    const state = useStore.getState()
    if (!state.wallet || !state.client?.node)
      throw new Error('Zkopru client not initialized')

    const [spendable, locked, erc20Info] = await Promise.all([
      state.wallet.wallet.getSpendableAmount(),
      state.wallet.wallet.getLockedAmount(),
      state.client.node.loadERC20Info(),
      state.wallet.wallet.getUtxos(undefined, [
        UtxoStatus.UNSPENT,
        UtxoStatus.SPENDING
      ])
    ])
    // DEV: skip the bugged test token contract
    const tokenBlacklist = [
      '0x560bd972e69f4dc15abf6093fcff2bc7e14f9239'.toLowerCase()
    ]
    const { erc20, eth } = spendable
    useStore.setState({
      registeredTokens: erc20Info.filter(({ address }) => {
        return tokenBlacklist.indexOf(address.toLowerCase()) === -1
      }),
      tokensByAddress: erc20Info.reduce((acc, token) => {
        // DEV: skip the bugged test token contract
        if (tokenBlacklist.indexOf(token.address.toLowerCase()) !== -1)
          return acc
        return {
          [token.address.toLowerCase()]: token,
          ...acc
        }
      }, {}),
      balance: fromWei(eth.toString())
    })

    let tokenBalances = {
      ...state.tokenBalances
    }
    for (const _address of Object.keys(erc20)) {
      const token = state.tokensByAddress[padAddress(_address.toLowerCase())]
      if (!token) continue
      tokenBalances = {
        ...tokenBalances,
        [token.symbol]: +erc20[_address].toString() / 10 ** +token.decimals
      }
    }
    useStore.setState({
      tokenBalances
    })

    {
      const { eth } = locked
      useStore.setState({
        lockedBalance: fromWei(eth.toString()),
        l2BalanceLoaded: true
      })
    }
  })
}
