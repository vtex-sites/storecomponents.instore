import React from 'react'
import startsWith from 'lodash/startsWith'
import noop from 'lodash/noop'
// import { withRouter } from 'react-router'
import CookieHelper from '@vtex/gatsby-theme-instore/utils/cookie'
import * as CustomEvent from '@vtex/gatsby-theme-instore/utils/customEvent'
import { InstoreDispatchContext } from '@vtex/gatsby-theme-instore/pages'

import CustomerAnonymous from './CustomerAnonymous'
import IdentificationSelector from './IdentificationSelector'
import IdentificationByPicture from './IdentificationByPicture'

interface Props {
  clearCustomer(...v: any[]): any // PropTypes.func.isRequired
  order: InstoreOrder // PropTypes.object
  onLoading(...v: any[]): any // PropTypes.func
  setCustomer(...v: any[]): any // PropTypes.func.isRequired
  loadInStoreOrderForm?(...v: any[]): any // PropTypes.func.isRequired
  onChangeIdentificationType(value: string): any // PropTypes.func.isRequired
  location?: Record<string, unknown> // PropTypes.object
  router?: string[] // FIXME: add a real router? // PropTypes.object
  route?: Record<string, unknown> // PropTypes.object
  visible: boolean // PropTypes.bool
  vendor?: Record<string, unknown> // PropTypes.object
}

type State = {
  showFullSummary: boolean
  loading: boolean
  slideIndex: number
  transferEnabled: boolean
}

export default class CustomerIdentification extends React.Component<
  Props,
  State
> {
  private identification: string
  private next: string

  public static defaultProps = {
    visible: true,
  }

  constructor(props: Props) {
    super(props)
    this.identification = ''
    this.next = '' // props.location.query.next
  }

  public componentDidUpdate(): void {
    if (!this.hasOrderForm()) {
      return
    }

    if (this.identification !== '') {
      this.next
        ? this.continueToNext()
        : this.continueToCart(this.identification)
      this.props.onLoading(false)
    } else if (this.next !== '') {
      this.continueToNext()
    }
  }

  public continueToNext() {
    const next = startsWith(this.next, '/') ? this.next : `/${this.next}`

    this.props.router?.push(next)
  }

  public handleSetCustomerIdentification = (identification: string): void => {
    this.identification = identification

    if (this.hasOrderForm()) {
      this.continueToCart(identification)
    } else {
      this.props.onLoading(true)
    }
  }

  public hasOrderForm(): boolean {
    const { orderForm } = this.props.order
    const orderFormIdCookie = CookieHelper.getOrderFormId()

    return !!(orderForm?.orderFormId && orderFormIdCookie)
  }

  public continueToCart(identification: string) {
    this.props.clearCustomer()
    if (!this.isSameCustomer(identification)) {
      this.props.setCustomer({
        identification,
        router: this.props.router,
      })
    } else {
      // this.props.router.push('/cart')
    }
  }

  public isSameCustomer(identification: string): boolean {
    const { orderForm } = this.props.order
    const currentEmail = orderForm?.clientProfileData?.email
    const currentDocument = orderForm?.clientProfileData?.document
    const isSameDocument = identification && identification === currentDocument

    return isSameDocument || identification === currentEmail
  }

  public handleChangeIdentificationType = (value: string): void => {
    this.props.onChangeIdentificationType(value)
  }

  public render(): React.ReactNode {
    const { visible, order } = this.props
    const { orderForm, identificationType } = order
    const clientProfileData = orderForm?.clientProfileData

    return (
      <div className="pt6 flex-auto flex-column">
        <div className="tc mb6-ns mb0">
          <div className="flex justify-center">
            <div className="f2-ns f3 tc fw7 tc w-30-l pt6-l pb0">
              Identify
              <br /> customer {/* TODO: should be translated */}
            </div>
          </div>
        </div>

        <IdentificationByPicture
          onSetCustomerIdentification={this.handleSetCustomerIdentification}
        />

        <IdentificationSelector
          getFocus
          requestFailed={noop} // TODO: can requestFailedFn be a noop?
          identification={clientProfileData}
          identificationType={identificationType}
          onChangeIdType={this.handleChangeIdentificationType}
          onSetCustomerIdentification={this.handleSetCustomerIdentification}
          visible={visible}
        />

        <div className="flex justify-center">
          <div className="w-30-l tc ph5 mid-gray lh-copy f6 f5-ns mt5">
            By identifying the customer, they will receive the receipt by email.{' '}
            {/* TODO: should be translated */}
          </div>
        </div>

        <CustomerAnonymous
          onSetCustomerIdentification={this.handleSetCustomerIdentification}
        />
      </div>
    )
  }
}
