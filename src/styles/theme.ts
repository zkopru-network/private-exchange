export type Theme = {
  background: string
  surface: string
  primary: string
  border: string
  error: string
  warning: string
  disabled: string
  control: string
  textMain: string
  textSub: string
  onPrimary: string
  onError: string
  onWarning: string
  onDisabled: string
}

const theme: Theme = {
  background: '#282A2D', // Gray 900
  surface: '#373A3E', // Gray 800
  error: '#ff0f0f',
  warning: '#f4512c',
  primary: '#FFFFFF',
  border: '#FFFFFF',
  disabled: '#9EA3A7', // Gray 400
  control: '#e8dcff',
  // Text
  textMain: '#FFFFFF',
  textSub: '#D0D1D2', // Gray300

  onError: '#FFFFFF',
  onWarning: '#FFFFFF',
  onPrimary: '#000000',
  onDisabled: '#FFFFFF'
}

export default theme
