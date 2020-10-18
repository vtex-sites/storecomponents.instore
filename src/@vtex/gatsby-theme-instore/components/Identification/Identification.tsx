import React from 'react'
import { noop } from 'lodash'
import classNames from 'classnames'
import { getInstoreConfig } from '@vtex/gatsby-theme-instore/utils/config'
import Swiper from 'react-id-swiper'

import Loader from '../Loader'
import Footer from '../Footer'
// import * as CustomEvent from '@vtex/gatsby-theme-instore/utils/customEvent'

import CustomerIdentification from './CustomerIdentification'
// import CartCapture from './CartCapture'

const IDENTIFICATION_SLIDE = 0
const CART_SLIDE = 1

interface Props {
  router?: any // PropTypes.any,
  route?: Record<string, unknown> // PropTypes.object,
  location?: Record<string, unknown> // PropTypes.object,
  clearCustomer(...v: any[]): any // PropTypes.func.isRequired,
  clearSearch(...v: any[]): any // PropTypes.func.isRequired,
  order: InstoreOrder // PropTypes.object.isRequired,
  onChangeIdentificationType(value: string): any
}

type State = {
  showFullSummary: boolean
  loading: boolean
  slideIndex: number
  transferEnabled: boolean
}

export default class Identification extends React.Component<Props, State> {
  private swiper = React.createRef<HTMLDivElement>()

  constructor(props: Props) {
    super(props)

    const initialSlide = props.route?.cartCapture
      ? CART_SLIDE
      : IDENTIFICATION_SLIDE

    this.state = {
      showFullSummary: false,
      loading: false,
      slideIndex: initialSlide,
      transferEnabled: getInstoreConfig().transferEnabled,
    }
  }

  public handleToggleSummary = (): void => {
    this.setState((prevState) => ({
      showFullSummary: !prevState.showFullSummary,
    }))
  }

  public handleLoading = (loading: boolean): void => {
    this.setState({ loading })
  }

  public onSetCustumer = (e, ...args) => {
    console.log('----------->', e, ...args)
  }

  public render(): React.ReactNode {
    const { showFullSummary, loading, slideIndex, transferEnabled } = this.state
    const { router, order } = this.props
    const orderForm = order?.orderForm
    const clientProfileData = orderForm?.clientProfileData

    // const swiperParams = {
    //   pagination: {
    //     el: '.swiper-pagination',
    //     clickable: true,
    //   },
    //   initialSlide: slideIndex,
    //   threshold: 15,
    //   on: {
    //     slideChange: () => {
    //       if (!this.swiper) return
    //       this.setState({
    //         slideIndex: this.swiper.activeIndex,
    //       })
    //     },
    //   },
    //   noSwiping: !transferEnabled,
    //   shouldSwiperUpdate: true,
    // }

    return (
      <div className="flex flex-auto flex-column flex-row-l relative vh-100">
        <div
          className={classNames(
            'flex animate-height bg-light-silver overflow-auto flex-auto',
            { 'swiper-no-pagination': !transferEnabled },
            showFullSummary ? 'flex-shrink' : 'flex-grow'
          )}
        >
          <Swiper
            // ref={(el: React.RefObject<HTMLDivElement>) => {
            //   this.swiper = el?.swiper
            // }}
            containerClass="flex flex-auto overflow-hidden"
            // {...swiperParams}
          >
            <div className="ph5">
              <CustomerIdentification
                onChangeIdentificationType={
                  this.props.onChangeIdentificationType
                }
                setCustomer={this.onSetCustumer} // FIXME: realy use setCustomer
                order={this.props.order}
                clearCustomer={this.props.clearCustomer}
                location={this.props.location}
                router={this.props.router}
                route={this.props.route}
                onLoading={this.handleLoading}
                key="customer-identification"
                visible={slideIndex === IDENTIFICATION_SLIDE}
              />
            </div>

            {transferEnabled && (
              <div className="ph5">
                {/* <CartCapture
                  router={router}
                  visible={slideIndex === CART_SLIDE}
                /> */}
              </div>
            )}
          </Swiper>
        </div>

        {/* TODO: use React Portals for the Loader */}
        <Loader loading={loading} />

        {clientProfileData &&
          (clientProfileData.email != null ||
            clientProfileData.document != null) && (
            <Footer
              showFullSummary={this.state.showFullSummary}
              onHandleToggleSummary={this.handleToggleSummary}
            />
          )}
      </div>
    )
  }
}
