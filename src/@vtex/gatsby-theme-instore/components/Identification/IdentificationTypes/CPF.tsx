import React from 'react'
import {
  isValidCPF,
  maskCPF,
  clearMask,
} from '@vtex/gatsby-theme-instore/utils/cpf'

import IdentificationInput from '../IdentificationInput'

interface Props {
  data: InstoreProfileData
}

// eslint-disable-next-line react/prefer-stateless-function
class CPFInput extends React.Component<Props> {
  public validate = (v: string): boolean => {
    return v.length === 11 ? isValidCPF(v) : true
  }

  public render(): React.ReactNode {
    const { data, ...rest } = this.props

    const placeholder = '000.000.000-00'

    return (
      <IdentificationInput
        maxLength={placeholder.length}
        inputType="tel"
        placeholder={placeholder}
        mask={maskCPF}
        normalize={clearMask}
        verifyInput={this.validate}
        validate={isValidCPF}
        errorMessage="Invalid CPF"
        invalidInputMessage="Invalid CPF number"
        initialValue={clearMask(data.document)}
        // shouldDisableButton={(v: string) => !isValidCPF(v)}
        {...rest}
      />
    )
  }
}

export default {
  label: 'CPF',
  id: 'CPF',
  enabledByDefault: true,
  Component: CPFInput,
}
