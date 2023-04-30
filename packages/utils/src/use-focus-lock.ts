import React from 'react'

const focuableTags = [
  "a[href]:not([tabIndex='-1'])",
  "area[href]:not([tabIndex='-1'])",
  "input:not([disabled]):not([tabIndex='-1'])",
  "select:not([disabled]):not([tabIndex='-1'])",
  "textarea:not([disabled]):not([tabIndex='-1'])",
  "button:not([disabled]):not([tabIndex='-1'])",
  "iframe:not([tabIndex='-1'])",
  "[tabIndex]:not([tabIndex='-1'])",
  "[contentEditable=true]:not([tabIndex='-1'])"
].join(',')

/**
 * @deprecated This component is deprecated in favour of react-focus-lock and will be removed in the next major release.
 */

function useFocusLock(
  wrapper: React.MutableRefObject<HTMLElement | null>,
  initialFocus?: React.MutableRefObject<HTMLElement | null>
) {
  const focusableElements = React.useRef<HTMLElement[]>([])

  React.useEffect(() => {
    if (!wrapper.current) return
    focusableElements.current = Array.from(
      wrapper.current?.querySelectorAll<HTMLElement>(focuableTags)
    )
  })

  // handle initial focus or focus on first element if no initial focus
  React.useEffect(() => {
    if (initialFocus?.current) {
      return initialFocus.current.focus()
    }

    if (focusableElements?.current?.length > 0) {
      return focusableElements.current[0].focus()
    }
  })

  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (!wrapper.current) return

      const isTabKey = event.key === 'Tab'

      const firstFocusableElement = focusableElements.current[0]
      const lastFocusableElement =
        focusableElements.current[focusableElements.current.length - 1]

      if (!isTabKey) return

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault()
        lastFocusableElement.focus()
        return
      }

      if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault()
        firstFocusableElement.focus()
      }
    },

    [wrapper]
  )

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])
}

/**
 *
 * Thanks to Headless UI for this approach
 */
function sortByDomNode<T>(
  nodes: T[],
  compareFn: (item: T) => HTMLElement | null = (i) =>
    i as unknown as HTMLElement | null
): T[] {
  return nodes.sort((a, b) => {
    const at = compareFn(a)
    const bt = compareFn(b)

    if (at === null || bt === null) return 0

    const position = at.compareDocumentPosition(bt)

    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  })
}

export { useFocusLock, sortByDomNode }
