import React from 'react'
import classNames from 'classnames'
import {
  genericCriticalError,
  genericImportantError,
} from '@vtex/gatsby-theme-instore/utils/event'
import Spinner from '@vtex/styleguide/lib/Spinner'

import Button from '../Button'

const MAX_LOADING_TIME = 15
const BAD_LOADING_TIME = 10

interface Props {
  hasBg: boolean // PropTypes.bool,
  loading: boolean // PropTypes.any,
  waitToShow: number // PropTypes.number,
  maxLoadingTime: number // PropTypes.number,
  badLoadingTime: number // PropTypes.number,
  // router: object // PropTypes.object.isRequired,
}

interface State {
  seconds: number
  loading: boolean
  showReloadButton: boolean
}

export default class Loader extends React.Component<Props, State> {
  public static defaultProps = {
    waitToShow: 0,
    hasBg: true,
    maxLoadingTime: MAX_LOADING_TIME,
    badLoadingTime: BAD_LOADING_TIME,
  }

  public hideTimeout: number | undefined
  public timer: number | undefined

  constructor(props: Props) {
    super(props)
    this.state = {
      seconds: 0,
      loading: props.loading,
      showReloadButton: false,
    }
    this.hideTimeout = undefined
    this.timer = undefined
  }

  public componentDidMount(): void {
    this.handleCounting(this.state.loading)
  }

  public handleSplunkLoadingLog = (): void => {
    if (this.state.seconds >= this.props.maxLoadingTime) {
      genericCriticalError('bad-loading-time', {
        context: 'Internal',
        message: `app was loading for ${this.state.seconds} seconds`,
      })
    } else if (this.state.seconds >= this.props.badLoadingTime) {
      genericImportantError('bad-loading-time', {
        context: 'Internal',
        seconds: `app was loading for ${this.state.seconds} seconds`,
      })
    }
  }

  public handlePressReloadButton = (e: Event): void => {
    e.preventDefault()
    this.handleSplunkLoadingLog()
    this.setState({ showReloadButton: false, seconds: 0 })
    window.location.reload()
  }

  public handlePressBackButton = (e: Event): void => {
    e.preventDefault()
    this.handleSplunkLoadingLog()
    this.setState({ showReloadButton: false, seconds: 0 })
    // const { router } = this.props
    // router.push('/')
  }

  public handleCounting = (loading: boolean): void => {
    if (loading) {
      this.setState({ loading: true })
      window.clearTimeout(this.hideTimeout)
      window.clearInterval(this.timer)
      this.hideTimeout = undefined
      this.timer = window.setInterval(() => {
        this.setState((prevState) => {
          return {
            showReloadButton: prevState.seconds >= this.props.maxLoadingTime,
            seconds: prevState.seconds + 1,
          }
        })
      }, 1000)
    } else {
      window.clearInterval(this.timer)
      this.timer = undefined

      this.handleSplunkLoadingLog()
      this.setState({ showReloadButton: false, seconds: 0 })

      this.hideTimeout = window.setTimeout(() => {
        if (this.hideTimeout) {
          this.setState({ loading: false })
        }
      }, 200)
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    this.handleCounting(nextProps.loading)
  }

  public componentWillUnmount() {
    window.clearInterval(this.timer)
    window.clearTimeout(this.hideTimeout)
    this.timer = undefined
    this.hideTimeout = undefined
  }

  public render(): React.ReactNode {
    // TODO: use React Portals
    return (
      <div className="">
        {this.state.loading && this.state.seconds >= this.props.waitToShow ? (
          <div id="loaderContent" className="aspect-ratio--object z-999">
            <div
              className={`aspect-ratio--object flex ${classNames({
                'bg-white-90': this.props.hasBg,
              })}`}
            />
            <div className="aspect-ratio--object flex items-center tc f3-ns">
              <div className="flex-auto">
                <div className="message">
                  {this.state.seconds >= this.props.badLoadingTime ? (
                    <span>Waiting for server response.</span>
                  ) : null}
                </div>
                <br />
                <div className="f4-ns mv6 mv7-ns">
                  <Spinner size={60} />
                </div>
                {this.state.showReloadButton ? (
                  <div>
                    <div className="">
                      <span>Is server taking too long to respond?</span>
                    </div>
                    <br />
                    <span className="pr5">
                      <Button
                        id="reload-app"
                        kind="danger"
                        type="submit"
                        onClick={this.handlePressReloadButton}
                      >
                        Reload inStore
                      </Button>
                    </span>
                    <span>
                      <Button
                        id="back-app"
                        kind="tertiary"
                        type="submit"
                        onClick={this.handlePressBackButton}
                      >
                        Back
                      </Button>
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    )
  }
}
