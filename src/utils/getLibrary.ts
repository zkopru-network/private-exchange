import { ethers } from 'ethers'

export default function getLibrary(provider?: any) {
  return new ethers.providers.Web3Provider(provider)
}
