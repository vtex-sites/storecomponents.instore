import React from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'

import withOrderFormAndVendor from 'order/withOrderFormAndVendor'
import { getOrderFormId } from 'utils/orderFormUtils'

const QRCodeGenerator = ({ orderForm, ...props }) =>
  orderForm && <QRCode value={getOrderFormId(orderForm)} {...props} />

QRCodeGenerator.propTypes = {
  orderForm: PropTypes.object,
}

export default withOrderFormAndVendor(QRCodeGenerator)
