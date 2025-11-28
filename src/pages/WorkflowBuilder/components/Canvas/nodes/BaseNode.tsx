import React from 'react'
import { nodeStyle, type CustomNodeProps } from '.'
import { cx } from '@/utils/cx'

export interface Props extends CustomNodeProps {
  children?: React.ReactNode
}

export default function BaseNode(props: Props) {
  const { children } = props

  if (!children) return null

  return (
    <div
      className={cx(nodeStyle, {
        'border-primary': props.selected,
      })}
    >
      {children}
    </div>
  )
}
