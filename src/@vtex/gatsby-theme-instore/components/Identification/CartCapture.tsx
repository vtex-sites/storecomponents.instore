import React from 'react'

import uniqBy from 'lodash/uniqBy'

import Switcher from 'components/Commons/Elements/Switcher'
import Button from '@vtex/styleguide/lib/Button'
import Selector from 'components/Commons/Elements/Selector'
import SimpleModal from 'components/Commons/Elements/SimpleModal'
import QRCodeIcon from 'assets/images/qr-code-24-dark.svg'
import * as MasterdataFetcher from 'fetchers/MasterdataFetcher'
import * as WebViewBridge from 'utils/WebViewBridge'
import BarcodeReader from 'utils/BarcodeReader'

import Order from './components/Order'
import { getVendorId } from 'utils/vendorUtils'
import QRCodeUtils from 'utils/QRCodeUtils'
import { searchCart } from 'transfer/service'
import Loader from '../Loader'

interface Props {
  getFocus: any // PropTypes.any,
  cartCaptureMode: string // PropTypes.string,
  cartCaptureValue: string // PropTypes.string,
  onSetCartCapture: func // PropTypes.func,
  onChangeIdType: func // PropTypes.func,
  selected: string // PropTypes.string,
  router: object // PropTypes.object.isRequired,
  visible: bool // PropTypes.bool,
  // intl: intlShape.isRequired,
}

CartCapture.defaultProps = {
  visible: false,
}

export default class CartCapture extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      captureMode: 0,
      code: '',
      carts: [],
      vendors: [],
      vendorsCarts: [],
      isCartSelectionVisible: false,
      loading: false,
      savedCarts: false,
    }
  }

  cartCaptureModes = [
    {
      id: 'code',
      label: 'Código',
    },
    {
      id: 'vendor',
      label: 'Vendedor',
    },
  ]

  handleToggleCaptureMode = (event, id, i) => {
    this.setState({
      captureMode: i,
    })
  }

  handleChange = (event) => {
    this.setState({
      code: event.target.value,
    })
  }

  handleBarcodeRead = (event) => {
    let { barcode } = event.data

    if (barcode) {
      barcode = String(barcode)
    }

    QRCodeUtils.handleReadQRCode(barcode)
  }

  submitQRCode = (code) => {
    if (code.length === 32) {
      this.props.router.push(`/cart-change/${code}`)
    } else {
      this.openBarcodeCameraReader()
    }
  }

  componentWillUnmount() {
    if (this.props.visible) {
      BarcodeReader.unlisten(this.handleBarcodeRead)
    }
    QRCodeUtils.setOnReadOrderFormId(null)
  }

  handleQRCodeClick = () => {
    this.openBarcodeCameraReader()
  }

  openBarcodeCameraReader() {
    WebViewBridge.sendEvent({ type: 'openBarcodeCameraVisible' })
  }

  searchCarts() {
    if (this.state.savedCarts) {
      return
    }
    MasterdataFetcher.searchSavedCarts().then((carts) => {
      if (!carts) {
        this.setState({
          carts: [],
          vendors: [],
        })
      }
      const vendorId = getVendorId()
      const validCarts = carts
        .filter((cart) => cart.numberOfItems > 0)
        .filter((cart) => cart.status !== 'order-placed')

      const vendors = uniqBy(validCarts, (cart) => cart.vendor)
        .map((vendorCart) => ({
          name: vendorCart.vendor_linked.name,
          id: vendorCart.vendor,
        }))
        .filter((vendor) => vendor.id !== vendorId)
      this.setState({ carts: validCarts, vendors, savedCarts: true })
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        BarcodeReader.listen(this.handleBarcodeRead)
        this.searchCarts()
      } else {
        BarcodeReader.unlisten(this.handleBarcodeRead)
      }
    }
  }

  componentDidMount() {
    if (this.props.visible) {
      BarcodeReader.listen(this.handleBarcodeRead)
      this.searchCarts()
    }
    QRCodeUtils.setOnReadOrderFormId(this.submitQRCode)
  }

  handleSelectVendor = (vendor) => {
    const { carts } = this.state
    this.setState({
      vendorsCarts: carts.filter((cart) => cart.vendor === vendor).slice(0, 10),
    })
    this.showCartSelection()
  }

  handleSelectCart = (orderFormId, code) => {
    this.props.router.push(`/cart-change/${orderFormId}/${code}`)
  }

  showCartSelection = () => {
    this.setState({
      isCartSelectionVisible: true,
    })
  }

  hideCartSelection = () => {
    this.setState({
      isCartSelectionVisible: false,
    })
  }

  handleCartSelectionClose = () => {
    this.hideCartSelection()
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { code } = this.state
    const { intl } = this.props

    this.setState({
      loading: true,
    })

    searchCart((cart) => cart.code === code)
      .then((cart) => {
        const { orderFormId, status } = cart

        this.setState({
          loading: false,
        })

        if (!orderFormId) {
          return Promise.reject({
            message: intl.formatMessage({
              id: 'cartNotFound',
            }),
          })
        }

        if (status && status === 'order-placed') {
          return Promise.reject({
            message: intl.formatMessage({
              id: 'cartAlreadyFinished',
            }),
          })
        }

        this.props.router.push(`/cart-change/${orderFormId}/${code}`)
      })
      .catch(() => {
        this.setState({
          loading: false,
        })
      })
  }

  render() {
    const {
      captureMode,
      code,
      vendors,
      vendorsCarts,
      isCartSelectionVisible,
      loading,
    } = this.state

    const { intl } = this.props
    const captureModeId = this.cartCaptureModes[captureMode].id

    // TODO: enable cart capture from salespeople
    const vendorCaptureEnabled = true

    return (
      <div className="pt6">
        <div className="tc mb6-ns mb0">
          <div className="flex justify-center">
            <div className="f2-ns f3 tc fw7 tc w-30-l pt6-l pb0">
              <FormattedHTMLMessage id="cartCaptureTitleHTML" />
            </div>
          </div>
        </div>

        <form
          className="form-horizontal text-center pa5 pt0-l"
          onSubmit={this.handleSubmit}
        >
          <div className="center mv4 mv5-ns mt0-l swiper-no-swiping">
            {vendorCaptureEnabled && (
              <Switcher
                options={this.cartCaptureModes}
                selected={captureMode}
                onSelect={this.handleToggleCaptureMode}
              />
            )}
          </div>
          <div className="mb4 mb5-ns tc">
            {captureModeId === 'code' ? (
              <React.Fragment>
                <input
                  id="cart-capture-code"
                  className="w-100 w-80-ns w-30-l pa5 ba b--black-20 f4-ns lh-copy-ns lh-solid-l swiper-no-swiping tc"
                  type="tel"
                  placeholder={intl.formatMessage({
                    id: 'codePlaceholder',
                  })}
                  value={code}
                  onChange={this.handleChange}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  autoCorrect="off"
                  ref={(ref) => (this.identification = ref)}
                />
                <div className="w-100 w-30-l w-80-ns mt4 mt5-ns center">
                  <Button
                    id="cart-capture-submit"
                    variation="primary"
                    size="large"
                    type="submit"
                    block
                  >
                    <FormattedMessage id="identifyClient" />
                  </Button>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Selector
                  onSelect={this.handleSelectVendor}
                  alwaysPopover
                  data={
                    vendors.length > 0
                      ? vendors.map((vendor) => ({
                          label: vendor.name,
                          value: vendor.id,
                        }))
                      : [
                          {
                            label: 'Nenhum vendedor encontrado',
                            value: null,
                            disabled: true,
                          },
                        ]
                  }
                  placeholder="Selecione o Vendedor"
                  renderCustomButton={({ currentValue, handleMenuOpen }) => (
                    <div className="b--black-20 w-100 w-80-ns w-30-l center">
                      <Button
                        variation="primary"
                        size="large"
                        block
                        onClick={handleMenuOpen}
                      >
                        {currentValue} <i className="fa fa-down-dir ml2" />
                      </Button>
                    </div>
                  )}
                />
                {isCartSelectionVisible && (
                  <SimpleModal onClose={this.handleCartSelectionClose}>
                    <div
                      style={{
                        maxHeight: '80vh',
                      }}
                    >
                      {vendorsCarts.map((cart, i) => (
                        <Order
                          key={i}
                          code={cart.code}
                          customerName={cart.customerName}
                          numberOfItems={cart.numberOfItems}
                          customerIdentification={cart.customerIdentification}
                          value={parseFloat(cart.cartTotal)}
                          date={cart.updatedIn}
                          orderFormId={cart.orderFormId}
                          onClick={this.handleSelectCart}
                        />
                      ))}
                    </div>
                  </SimpleModal>
                )}
              </React.Fragment>
            )}
            <div className="pt5 pb5">
              <FormattedMessage id="or" />
            </div>
            <Button
              variation="tertiary"
              inline={false}
              size="large"
              onClick={this.handleQRCodeClick}
            >
              <img src={QRCodeIcon} className="v-mid mr3" />{' '}
              <FormattedMessage id="readQRCode" />
            </Button>
          </div>
        </form>
        <Loader loading={loading} />
      </div>
    )
  }
}
