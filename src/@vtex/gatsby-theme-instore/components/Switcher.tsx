import React, { MouseEvent } from 'react'
import classNames from 'classnames'

export interface SwitcherOption {
  id: string
  label: string
}

interface Props {
  options: SwitcherOption[]
  selected: string
  onSelect(e: MouseEvent, selectedValue: string, index: number): void
}

export default class Switcher extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render(): React.ReactNode {
    const { options, selected, onSelect } = this.props

    return (
      <div className="tc">
        {options.map((option, i) => {
          const isSelected = i === selected || selected === option.id
          const isFirst = i === 0
          const isLast = i === options.length - 1

          return (
            <button
              id={`switcher-${option.id}`}
              type="button"
              key={`option-${option.id}`}
              className={`switcher-option dib pointer bn ${classNames({
                'br2 br--left': isFirst,
              })} ${classNames({ 'br2 br--right': isLast })} ${
                isSelected ? 'white' : 'black-40'
              } ${isSelected ? 'bg-action-primary' : 'bg-black-10'} ${
                options
                  ? 'ph5 f6 f4-ns f6-l pv3 lh-copy-ns'
                  : 'h1 h2-ns w1 w2-ns'
              } nowrap`}
              onClick={(event: MouseEvent) => onSelect(event, option.id, i)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    )
  }
}
