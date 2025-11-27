import React from 'react'
import type { CustomNodeProps } from '.'
import { useUpdateNodeInternals } from '@xyflow/react'

export interface Props extends CustomNodeProps {
  children?: React.ReactNode
}

export default function BaseNode(props: Props) {
  const { children, data, id } = props
  const updateNodeInternals = useUpdateNodeInternals()

  React.useEffect(() => {
    updateNodeInternals(id)
  }, [data])

  return children || null
}
