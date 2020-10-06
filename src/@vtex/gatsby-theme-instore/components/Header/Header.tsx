import React, { FC } from 'react'

type HeaderProps = {
  title: string
}

export const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <header>
      <div>{title}</div>
    </header>
  )
}
