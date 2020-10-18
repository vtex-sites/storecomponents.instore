import React from 'react'
import { noop } from 'lodash'
import * as EmailUtils from '@vtex/gatsby-theme-instore/utils/email'
import QRCodeUtils from '@vtex/gatsby-theme-instore/utils/qrCode'

import QRCodeButton from './QRCodeButton'
// import * as MasterdataFetcher from 'fetchers/MasterdataFetcher'

interface Props {
  onSubmit(value: string): any
  onError(message: string): any
  visible?: boolean
}

class QRCodeComponent extends React.Component<Props> {
  public static defaultProps = {
    visible: true,
  }

  public componentDidMount(): void {
    QRCodeUtils.setOnReadEmail(this.handleReadEmail)
    QRCodeUtils.setOnReadBarcode(this.handleReadBarcode)
  }

  public componentWillUnmount(): void {
    QRCodeUtils.setOnReadEmail(noop)
    QRCodeUtils.setOnReadBarcode(noop)
  }

  public handleReadQRCode(value: string): void {
    QRCodeUtils.handleReadQRCode(value)
  }

  public handleReadEmail(value: string): void {
    value = EmailUtils.cleanUpEmail(value)
    if (EmailUtils.validateEmail(value)) {
      this.props.onSubmit(value)
    } else {
      this.props.onError('Invalid QR Code') // TODO: should be translated
    }
  }

  public handleReadBarcode(value: string): void {
    // MasterdataFetcher.searchCustomerByBarcode(value)
    //   .then((result) => {
    //     const identification = result.email
    //     this.props.onSubmit(identification)
    //   })
    //   .catch(() => {
    //     this.props.onError('Barcode not found') // TODO: should be translated
    //   })
  }

  public render(): React.ReactNode {
    return (
      <QRCodeButton
        visible={this.props.visible}
        onReadQRCode={this.handleReadQRCode}
      />
    )
  }
}

export default {
  label: 'QR Code',
  id: 'QRCode',
  enabledByDefault: false,
  Component: QRCodeComponent,
}
