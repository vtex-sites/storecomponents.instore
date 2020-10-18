import React, { FC, Fragment } from 'react'
import { noop } from 'lodash'

import { components } from '../../../../instore-config.json'
import Header from '../Header'
import { Identification } from '../Identification'

interface State {
  order: InstoreOrder
}

const initialState = {
  order: {
    identificationType: 'Email',
    orderForm: {
      orderFormId: '',
      clientProfileData: {
        email: '',
        document: '',
      },
    },
  },
}

const ACTION_CHANGE_ORDER: string = 'instore/order/CHANGE_ORDER'

type ACTIONTYPE = { type: string; payload: Record<string, unknown> }

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case ACTION_CHANGE_ORDER: {
      return { ...state, order: { ...state.order, ...action.payload } }
    }

    default:
      throw new Error()
  }
}

export const AboveTheFold: FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <Fragment>
      {components.map((component) => {
        switch (component.name) {
          case 'Header':
            return <Header title="Um Header!" />

          case 'Identification':
            return (
              <Identification
                onChangeIdentificationType={(value: string) =>
                  dispatch({
                    type: ACTION_CHANGE_ORDER,
                    payload: { identificationType: value },
                  })
                }
                order={state.order}
                clearCustomer={noop}
                clearSearch={noop}
              />
            )

          default:
            return null
        }
      })}
    </Fragment>
  )
}
export default AboveTheFold
