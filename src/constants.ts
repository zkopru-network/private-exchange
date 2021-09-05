const FONT_SIZE = {
  XS: '10px',
  S: '14px',
  M: '16px',
  L: '20px',
  XL: '24px',
  XXL: '32px'
} as const

const SPACE = {
  XS: '4px',
  S: '8px',
  M: '16px',
  L: '20px',
  XL: '24px',
  XXL: '32px'
} as const

const RADIUS = {
  S: '4px',
  M: '8px',
  L: '12px',
  ROUND: '50%'
} as const

enum SupportedChainId {
  GOERLI = 5,
  LOCAL = 1337
}

export { FONT_SIZE, SPACE, RADIUS, SupportedChainId }
