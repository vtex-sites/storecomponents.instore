import React, { MouseEvent } from 'react'
import isEmpty from 'lodash/isEmpty'
import head from 'lodash/head'
import classNames from 'classnames'
import { logClickEvent } from '@vtex/gatsby-theme-instore/utils/event'
import { getIntlMessage } from '@vtex/gatsby-theme-instore/utils/i18n'
import * as CustomEvent from '@vtex/gatsby-theme-instore/utils/customEvent'
import { getAvailableIdentificationTypes } from '@vtex/gatsby-theme-instore/utils/customer'

import Switcher, { SwitcherOption } from '../Switcher'
import identificationTypes from './IdentificationTypes'
import { ClientProfileType } from './Identification'

type ErrorObj = {
  error: Error
  errorTitle: string
}

interface Props {
  getFocus: boolean
  identification: ClientProfileType
  identificationType: string
  onSetCustomerIdentification(value: string): void
  onChangeIdType(value: string): void
  visible: boolean
  requestFailed({ error, errorTitle }: ErrorObj): void
}

export default class IdentificationSelector extends React.Component<Props> {
  public handleSubmit = (value: string) => {
    const { identificationType } = this.props

    logClickEvent(`identify-by-${identificationType}`, 'Sale', {
      customer: value,
    })
    this.props.onSetCustomerIdentification(value)
  }

  public handleError = (error: Error) => {
    this.props.requestFailed({
      error,
      errorTitle: getIntlMessage('errorFallback'),
    })
  }

  public handleToggleIdentificationType = (e: MouseEvent, value: string) => {
    e.preventDefault()
    logClickEvent('toggle-identification-switcher', 'Sale')
    this.props.onChangeIdType(value)
  }

  public refreshDefaultIdentificationType(): void {
    const { identificationType } = this.props

    const availableIdentificationTypes = getAvailableIdentificationTypes(
      identificationTypes
    )

    if (!isEmpty(availableIdentificationTypes)) {
      const firstIdentificationType = head(availableIdentificationTypes).id

      if (
        firstIdentificationType !== identificationType &&
        this.props.onChangeIdType
      ) {
        this.props.onChangeIdType(firstIdentificationType)
      } else {
        this.forceUpdate()
      }
    }
  }

  public componentDidMount(): void {
    // Check configs loaded
    if (!isEmpty(window.LOCALE_MESSAGES)) {
      this.refreshDefaultIdentificationType()
    } else {
      CustomEvent.listenEvent('changeLocaleMessages', () =>
        setTimeout(() => this.refreshDefaultIdentificationType(), 100)
      )
    }

    CustomEvent.listenEvent(
      'config.updated',
      this.refreshDefaultIdentificationType
    )
  }

  public componentWillUnmount(): void {
    CustomEvent.unlistenEvent(
      'config.updated',
      this.refreshDefaultIdentificationType
    )
  }

  public render(): React.ReactNode {
    const {
      identificationType,
      getFocus,
      identification: identificationData,
      visible: identificationSelectorVisible,
    } = this.props

    // const availableIdentificationTypes = getAvailableIdentificationTypes(
    //   identificationTypes
    // )

    const availableIdentificationTypes = identificationTypes

    return (
      <div className="pa5 pt0-l">
        <div className="center mv4 mv5-ns mt0-l">
          <Switcher
            options={availableIdentificationTypes as SwitcherOption[]}
            selected={identificationType}
            onSelect={this.handleToggleIdentificationType}
          />
        </div>
        {availableIdentificationTypes.map((identification) => {
          const isIdentificationVisible =
            identification.id === identificationType

          return (
            <div
              className={classNames({ dn: !isIdentificationVisible })}
              key={identification.id}
            >
              <identification.Component
                key={`component${identification.id}`}
                data={identificationData}
                getFocus={getFocus}
                visible={
                  isIdentificationVisible && identificationSelectorVisible
                }
                onSubmit={this.handleSubmit}
                onError={this.handleError}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

declare global {
  interface Window {
    LOCALE_MESSAGES: any // TODO: can be better then any?
  }
}
