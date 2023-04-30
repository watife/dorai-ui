import { usePortal } from '@dorai-ui/utils/use-portal'
import React from 'react'
import ReactDOM from 'react-dom'

/**
 *
 * Portal component
 *
 */
type PortalType = {
  id?: string
  children: React.ReactNode
}
const DoraiPortal = ({ id, children }: PortalType) => {
  const target = usePortal(id)

  return ReactDOM.createPortal(children, target)
}

export { DoraiPortal }
