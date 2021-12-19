import ReactDOM from 'react-dom'
import { usePortal } from '../../hooks/use-portal'

/**
 *
 * Portal component
 *
 */
type PortalType = {
  id?: string
  children: React.ReactNode
}
const Portal = ({ id, children }: PortalType) => {
  const target = usePortal(id)

  return ReactDOM.createPortal(children, target)
}

export { Portal }
