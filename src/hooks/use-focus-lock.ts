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

export { useFocusLock }
