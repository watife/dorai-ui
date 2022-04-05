import ReactDOM from 'react-dom'
import { usePortal } from '@dorai-ui/utils/use-portal'

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
