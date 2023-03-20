import React from 'react'

function useOutsideClick(
  ref: React.MutableRefObject<HTMLElement | null>,
  handler: (event: MouseEvent) => void
) {
  const handleMouseEvent = React.useCallback(
    (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return
      handler(event)
    },
    [handler, ref]
  )

  React.useEffect(() => {
    window.addEventListener('mousedown', handleMouseEvent)
    return () => {
      window.removeEventListener('mousedown', handleMouseEvent)
    }
  }, [handleMouseEvent])
}

export { useOutsideClick }
