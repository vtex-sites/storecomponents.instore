import React, { FC } from 'react'
import noop from 'lodash/noop'

import { App } from '@vtex/gatsby-theme-instore/src/components/App/App'
import InstoreTopbar from '@vtex/gatsby-theme-instore/src/components/InstoreTopbar'
import { Identification } from '@vtex/gatsby-theme-instore/src/components/Identification'

type AppContainerProps = {}

const order = {
  identificationType: 'Email',
  orderForm: {
    orderFormId: '',
    clientProfileData: {
      email: '',
      document: '',
    },
  },
}

export const AppContainer: FC<AppContainerProps> = ({ children }) => (
  <App
    components={{
      topbar: <InstoreTopbar />,
      identification: (
        <Identification
          clearCustomer={noop}
          clearSearch={noop}
          onChangeIdentificationType={noop}
          order={order}
        />
      ),
    }}
    rules={['topbar', 'identification']}
  />
)
