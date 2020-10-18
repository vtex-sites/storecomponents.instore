import React from 'react'
import noop from 'lodash/noop'
import stubTrue from 'lodash/stubTrue'
import identity from 'lodash/identity'
import Button from '@vtex/styleguide/lib/Button'
import { handleInputMask } from '@vtex/gatsby-theme-instore/utils/input'
import { startClientProfileEvent } from '@vtex/gatsby-theme-instore/utils/event'

interface Props {
  inputType: string
  invalidInputMessage: string
  placeholder: string
  verifyInput(value: string): boolean
  validate(value: string): boolean
  mask(value: string): string
  normalize(value: string): string
  onSubmit(value: string): any
  onError(value: string): any
  errorMessage: string
  visible: boolean
  initialValue: string
  getFocus: boolean
  maxLength?: number
  shouldDisableButton(value: string): boolean
}

interface State {
  value: string
}

export default class IdentificationInput extends React.Component<Props, State> {
  private input: HTMLInputElement | null

  public static defaultProps = {
    inputType: 'text',
    maxLength: null,
    invalidInputMessage: null,
    placeholder: null,
    verifyInput: stubTrue,
    validate: stubTrue,
    mask: noop,
    normalize: identity,
    onSubmit: noop,
    onError: noop,
    errorMessage: '',
    visible: false,
    initialValue: '',
    getFocus: false,
    shouldDisableButton: () => false,
  }

  constructor(props: Props) {
    super(props)
    this.input = null
    this.state = {
      value: props.initialValue,
    }
  }

  public componentDidMount(): void {
    if (this.props.getFocus) {
      this.focus()
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: State): void {
    /* This function is a workaround for an android bug with input value changes.
    Cursor position stays at the same position when typing CPF with mask */
    const { mask } = this.props
    const { value } = this.state

    if (mask && this.input) {
      handleInputMask(prevState.value, value, mask, this.input)
    }
  }

  public handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value

    this.setState({
      value: this.props.normalize(value),
    })
  }

  public focus = (): void => {
    if (this.input?.focus) {
      this.input.focus()
    }
  }

  public handleFocus = (): void => {
    startClientProfileEvent()
  }

  public handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const { normalize, validate, onSubmit, onError, errorMessage } = this.props
    const { value } = this.state
    const normalizedValue = normalize(value)

    if (!normalizedValue) {
      // ignore empty values
      return
    }

    const isValid = validate(normalizedValue)

    if (isValid) {
      onSubmit(normalizedValue)
    } else {
      onError(errorMessage)
    }
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.initialValue !== this.props.initialValue) {
      this.setState({
        value: nextProps.initialValue,
      })
    }

    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        setTimeout(() => {
          /* this timeout solves keyboard type change in Android devices due to toogling
      and focusing too fast (keyboard hides instead of changing type as expected) */
          if (this.input?.focus) {
            this.input.focus()
          }
        }, 5)
      }
    }
  }

  public render(): React.ReactNode {
    const {
      inputType,
      placeholder,
      invalidInputMessage,
      verifyInput,
      mask,
      normalize,
    } = this.props

    const { value } = this.state

    const isValid = verifyInput(value)
    let formattedValue = mask(value)

    formattedValue = formattedValue || ''
    const normalizedValue = normalize(value)

    const extraProps: Record<string, any> = {}

    if (this.props.maxLength) {
      extraProps['maxLength'] = this.props.maxLength
    }

    return (
      <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="mb4 mb5-ns tc">
          <input
            id="identification"
            className="w-100 w-80-ns w-30-l pa5 ba b--black-20 f4-ns lh-copy-ns lh-solid-l"
            type={inputType}
            placeholder={placeholder}
            value={formattedValue}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            autoCorrect="off"
            ref={(ref: HTMLInputElement) => {
              this.input = ref
            }}
            {...extraProps}
          />
        </div>
        {!isValid && invalidInputMessage && (
          <div className="light-red mt4 mb3 tc f4-ns">
            {invalidInputMessage}
          </div>
        )}
        <div className="w-100 w-30-l w-80-ns mt4 mt5-ns flex center">
          <Button
            id="customeridentifier-submit"
            kind="success"
            size="large"
            type="submit"
            disabled={this.props.shouldDisableButton(value)}
            block
          >
            Identify client {/* TODO: should be translated */}
          </Button>
        </div>
      </form>
    )
  }
}
