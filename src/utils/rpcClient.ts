import axios from 'axios'
import { RPC_ROOT } from '../constants'

class RpcClient {
  // TODO: set using coordinator address

  async getRegisteredTokens() {
    return await axios.post(RPC_ROOT, {
      jsonrpc: '2.0',
      method: 'l2_getRegisteredTokens'
    })
  }

  async getL1Address() {
    return await axios.post(RPC_ROOT, {
      jsonrpc: '2.0',
      method: 'l1_address'
    })
  }
}

export default new RpcClient()
