import React from 'react'

// import Summary from 'components/Commons/Summary'
import { isDesktopBreakpoint } from '@vtex/gatsby-theme-instore/utils/mediaQuery'

interface Props {
  showFullSummary: boolean // PropTypes.bool,
  onHandleToggleSummary(): any // PropTypes.func,
  rightElement?: React.ReactNode // PropTypes.node,
}

export default class Footer extends React.Component<Props> {
  public handleSummaryAnimation = (): void => {
    if (!isDesktopBreakpoint()) {
      this.props.onHandleToggleSummary()
    }
  }

  public render(): React.ReactNode {
    const { showFullSummary, children, rightElement } = this.props

    if (!children) return null

    return (
      <div
        id="Footer"
        className={`flex flex-column
                  ${
                    showFullSummary
                      ? 'flex-auto h-100'
                      : 'flex-none flex-auto-l'
                  }
        `}
      >
        {/* <Summary
          showFullSummary={showFullSummary}
          onHandleToggleSummary={this.handleSummaryAnimation}
          rightElement={rightElement}
        >
          {children}
        </Summary> */}
      </div>
    )
  }
}
