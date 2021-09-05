export type Theme = {
  background: string
  surface: string
  primary: string
  secondary: string
  border: string
  error: string
  disabled: string
  control: string
  shadow: string
  onPrimary: string
  onSecondary: string
  onBackground: string
  onSurface: string
  onError: string
  onDisabled: string
}

const theme: Theme = {
  background: '#F8F9FF',
  surface: '#FFFFFF',
  error: '#ff0230',
  primary: '#9473d4',
  secondary: '#c9e977',
  border: 'gray',
  disabled: 'gray',
  control: '#e8dcff',
  shadow: 'gray',
  onBackground: '#000000',
  onSurface: '#000000',
  onError: '#FFFFFF',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onDisabled: '#FFFFFF'
}

export default theme
