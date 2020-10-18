import React from 'react'
import classNames from 'classnames'

const BUTTON_SIZES: Record<string, string> = {
  xs: 'pa3 f7 f6-ns ',
  sm: 'pa4 pa5-ns f6 f5-ns ',
  mdMobile: 'w9 pv4 ',
  md: 'w9 pv4 pv5-l ',
  lg:
    'pv5 ph6 pa6-ns f4 f3-ns f4-l pv5-l ph7-l lh-solid-ns items-center lh-copy-l ',
  xl: 'pa6 pa7-ns f3 f2-ns ',
  default: 'pv5 ph6 pa6-ns f5 f4-ns ',
}

const BUTTON_KINDS = (disabled: boolean): Record<string, string> => ({
  success: classNames('bg-success c-on-success b--success ', {
    'hover-bg-success ': !disabled,
  }),
  primary: classNames(
    'bg-action-primary c-on-action-primary b--action-primary ',
    {
      'hover-bg-action-primary ': !disabled,
    }
  ),
  info: classNames('bg-action-primary c-on-action-primary b--action-primary ', {
    'hover-bg-action-primary ': !disabled,
  }),
  alert: classNames('bg-warning c-on-warning b--warning ', {
    'hover-bg-warning ': !disabled,
  }),
  danger: classNames('bg-danger c-on-danger b--danger ', {
    'hover-bg-danger hover-c-on-danger ': !disabled,
  }),
  muted: classNames('bg-muted-5 c-on-muted-5 b--muted-5 ', {
    'hover-bg-muted-5 ': !disabled,
  }),
  link: classNames('bg-base c-action-primary b--action-primary ', {
    'hover-bg-dark-green ': !disabled,
  }),
  'link-danger': classNames('bg-base bn c-danger ', {
    'hover-bg-light-silver ': !disabled,
  }),
  'light-primary': classNames(
    'bg-base c-action-primary b--action-primary truncate-l ',
    {
      'hover-bg-action-secondary hover-c-on-action-secondary ': !disabled,
    }
  ),
  'light-success': classNames('bg-base c-success b--success ', {
    'hover-bg-light-silver ': !disabled,
  }),
  'light-danger': classNames('bg-base c-danger b--danger ', {
    'hover-bg-light-silver ': !disabled,
  }),
  dropdown: classNames('bg-base c-action-primary truncate-l b--white ', {
    'hover-bg-light-silver ': !disabled,
  }),
  default: classNames('bg-light-silver c-action-primary b--near-white ', {
    'hover-bg-black-10 ': !disabled,
  }),
})

interface Props {
  disabled: boolean
  isLoading: boolean
  inline: boolean
  lonely: boolean
  fixedValue: boolean
  fullWidth: boolean
  checked: boolean
  kind: string
  size: string
  modal: boolean
  children: React.ReactChild
  className: string
  type: 'button' | 'submit' | 'reset' | undefined
}

export default class Button extends React.Component<Props> {
  public static defaultProps = {
    fixedValue: true,
    checked: false,
    className: '',
    size: '',
    type: 'button',
    modal: false,
    fullWidth: false,
    inline: true,
    lonely: true,
  }

  public render(): React.ReactNode {
    const {
      kind,
      size,
      modal,
      fullWidth,
      inline,
      lonely,
      isLoading,
      disabled,
      children,
      fixedValue,
      checked,
      className,
      type,
      ...rest
    } = this.props
    let style = 'relative tc ba fw3 bg-animate '
    const kinds = BUTTON_KINDS(disabled)
    const isDropdown = kind === 'dropdown'
    style += kinds[kind] || kinds.default
    style += BUTTON_SIZES[size] || BUTTON_SIZES.default
    style += classNames(disabled ? 'o-50 ' : 'pointer', {
      'db ': !inline,
      'w-100 ': !inline && !modal && !isDropdown,
      'mh3 ': !lonely,
      'w-50 center flex justify-center ': modal,
      'center-l flex justify-center w-100 ': isDropdown,
      'w-100-l ': fullWidth,
    })

    return (
      <button
        disabled={disabled}
        className={`${style} ${className} noselect`}
        type={type}
        {...rest}
      >
        {isLoading ? (
          <i className="fa fa-circle-notch fa-spin fa-fw mr3 absolute left-1" />
        ) : null}
        {children}
        {fixedValue ? null : <i className="fa fa-down-dir absolute right-1" />}
        {checked && <i className="fa fa-ok absolute right-1" />}
      </button>
    )
  }
}
