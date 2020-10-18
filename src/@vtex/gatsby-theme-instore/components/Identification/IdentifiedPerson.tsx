import React from 'react'
import { logClickEvent } from '@vtex/gatsby-theme-instore/utils/event'

import { IdentificationType } from './IdentificationByPicture'
import placeholder from '../../images/sku-placeholder.svg'

interface IdentifiedPersonType {
  identification: IdentificationType
  onSetCustomerIdentification(email: string): void
}

export default function IdentifiedPerson({
  identification,
  onSetCustomerIdentification,
}: IdentifiedPersonType) {
  const { email, firstName, lastName, hasSameName, photoUrl } = identification

  return (
    <button
      onClick={() => {
        logClickEvent('identify-by-falco-checkin', 'Sale')
        onSetCustomerIdentification(email)
      }}
      className="pa4-ns ph4 pt4 tc relative pointer hide-scrollbar"
      key={email}
    >
      <div
        className="br-100 h3 w3 dib ba bw1 c-action-primary overflow-x-hidden mh4 hide-scrollbar"
        style={{
          padding: '2px',
        }}
      >
        <div
          style={{
            backgroundColor: '#ccc',
            backgroundImage: `url(${photoUrl || placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: '50% 50%',
          }}
          className="br-100 w-100 h-100 dib hide-scrollbar"
        />
      </div>
      <p className="tc f5 mv4-ns mb0 mt4">
        {hasSameName ? `${firstName} ${lastName.charAt(0)}.` : firstName}
      </p>
    </button>
  )
}
