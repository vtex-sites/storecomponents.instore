import React from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { logClickEvent } from '@vtex/gatsby-theme-instore/utils/event'
import * as WebViewBridge from '@vtex/gatsby-theme-instore/utils/webView'
import BarcodeReader from '@vtex/gatsby-theme-instore/utils/barcode'
import { KeyboardBarcode } from '@vtex/gatsby-theme-instore/utils/keyboard'
import Button from '../../../Button'

import QRCodeIcon from '../../../../images/qr-code-24.svg'

interface Props {
  onReadQRCode(v: string): any
  visible: boolean
}

export default class QRCodeButton extends React.Component<Props> {
  public static defaultProps = {
    visible: true,
  }

  public componentDidMount(): void {
    if (this.props.visible) {
      BarcodeReader.listen(this.handleBarcodeRead)
    }
  }

  public componentWillUnmount(): void {
    if (this.props.visible) {
      BarcodeReader.unlisten(this.handleBarcodeRead)
    }
  }

  public componentDidUpdate(prevProps: Props): void {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        BarcodeReader.listen(this.handleBarcodeRead)
      } else {
        BarcodeReader.unlisten(this.handleBarcodeRead)
      }
    }
  }

  public handleBarcodeRead(event: KeyboardBarcode): void {
    const { barcode } = event.data

    this.props.onReadQRCode(barcode)
  }

  public handleClick = () => {
    logClickEvent('read-qr-code', 'Sale')

    this.openBarcodeCameraReader()
  }

  public openBarcodeCameraReader() {
    WebViewBridge.sendEvent({ type: 'openBarcodeCameraVisible' })
  }

  public render(): React.ReactNode {
    return (
      <div
        id="customer-qrcode-button"
        className="tc pt4 w-100 w-30-l w-80-ns center"
      >
        <Button
          kind="success"
          // id="qrcode-button"
          size="lg"
          type="button"
          inline={false}
          onClick={this.handleClick}
        >
          <img src={QRCodeIcon} className="v-mid mr3" alt="QRCode" />
          Scan QR Code
        </Button>
      </div>
    )
  }
}
