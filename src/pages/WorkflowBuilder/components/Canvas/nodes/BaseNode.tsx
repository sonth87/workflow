import React from 'react'
import type { CustomNodeProps } from '.'

export interface Props extends CustomNodeProps {
  children?: React.ReactNode
}

export default function BaseNode(props: Props) {
  const { children } = props

  return children || null
}
