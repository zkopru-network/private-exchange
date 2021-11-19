export type Theme = {
  background: string
  surface: string
  surface2: string
  primary: string
  secondary: string
  border: string
  error: string
  warning: string
  disabled: string
  control: string
  shadow: string
  onPrimary: string
  onSecondary: string
  onBackground: string
  onSurface: string
  onError: string
  onWarning: string
  onDisabled: string
}

const theme: Theme = {
  background: '#05141A',
  surface: '#081B24',
  surface2: '#192C35',
  error: '#ff0f0f',
  warning: '#f4512c',
  primary: '#A2EfE1',
  secondary: '#c9e977',
  border: '#2A3D46',
  disabled: 'gray',
  control: '#e8dcff',
  shadow: 'gray',
  onBackground: '#95A7AE',
  onSurface: '#FFFFFF',
  onError: '#FFFFFF',
  onWarning: '#FFFFFF',
  onPrimary: 'black',
  onSecondary: '#000000',
  onDisabled: '#FFFFFF'
}

export default theme
