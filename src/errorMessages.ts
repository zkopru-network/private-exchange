export const FORM_ERRORS = {
  required: 'This field is required',
  positiveNumber: 'Value must be positive number'
} as const

export function getFormErrorMessage(errorType: string | undefined) {
  if (!errorType) return ''

  return Object.keys(FORM_ERRORS).includes(errorType)
    ? FORM_ERRORS[errorType as keyof typeof FORM_ERRORS]
    : ''
}
