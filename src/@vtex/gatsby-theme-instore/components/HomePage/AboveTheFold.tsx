import React, { FC, Fragment } from 'react'

import { components } from '../../../../instore-config.json'
import Header from '../Header'

export const AboveTheFold: FC = () => {
  return (
    <Fragment>
      {components.map((component) => {
        switch (component.name) {
          case 'Header':
            return <Header title="Um Header!" />
          default:
            return null
        }
      })}
    </Fragment>
  )
}
export default AboveTheFold
