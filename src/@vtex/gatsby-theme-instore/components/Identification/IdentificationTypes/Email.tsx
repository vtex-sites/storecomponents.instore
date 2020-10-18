import React from 'react'
import {
  clearIfInStoreAnonymousEmail,
  validateEmail,
} from '@vtex/gatsby-theme-instore/utils/email'

import IdentificationInput from '../IdentificationInput'

interface Props {
  data: InstoreProfileData
}

class EmailInput extends React.Component<Props> {
  public clearEmail(email: string): string {
    return clearIfInStoreAnonymousEmail(email)
  }

  public render(): React.ReactNode {
    const { data, ...rest } = this.props

    return (
      <IdentificationInput
        inputType="email"
        placeholder="email@email.com"
        mask={this.clearEmail}
        normalize={this.clearEmail}
        validate={validateEmail}
        errorMessage="Invalid Email" // TODO: should to be translated
        initialValue={data.email}
        shouldDisableButton={(v: string) => !validateEmail(v)}
        {...rest}
      />
    )
  }
}

export default {
  label: 'Email',
  id: 'Email',
  enabledByDefault: true,
  Component: EmailInput,
}
