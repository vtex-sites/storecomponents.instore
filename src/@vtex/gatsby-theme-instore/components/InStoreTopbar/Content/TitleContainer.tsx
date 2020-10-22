import React from 'react'

import Title from '@vtex/gatsby-theme-instore/src/components/InStoreTopbar/Content/Title'

const TitleContainer: React.FC<{ value: number }> = ({ value }) => {
  const newValue = value * 2
  return <Title title={`inStore ${newValue}`} />
}

export default TitleContainer
