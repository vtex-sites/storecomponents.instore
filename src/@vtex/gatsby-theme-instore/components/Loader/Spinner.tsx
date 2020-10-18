import React from 'react'

interface Props {
  fg: string // PropTypes.string,
  bg: string // PropTypes.string,
  size: number // PropTypes.number,
  className: string // PropTypes.string,
  spinDuration: number // PropTypes.number,
}

const Spinner: React.FC<Props> = ({
  fg = '#357edd',
  bg = '#e8e8e8',
  size = 50,
  className = '',
  spinDuration = 450,
}: Props) => {
  return (
    <div
      className={`spinner ${className}`}
      style={{
        borderColor: bg,
        borderTopColor: fg,
        width: size,
        height: size,
        animationDuration: `${spinDuration}ms`,
      }}
    />
  )
}

export default Spinner
