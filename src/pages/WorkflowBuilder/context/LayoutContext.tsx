import { createContext, useContext } from 'react'
import type { LayoutDirection } from '../components/Header'

interface LayoutContextValue {
  direction: LayoutDirection
}

const LayoutContext = createContext<LayoutContextValue>({ direction: 'vertical' })

export const useLayout = () => useContext(LayoutContext)

export default LayoutContext
