import React from 'react'

function createRootElement(id: string) {
  const rootContainer = document.createElement('div')
  rootContainer.setAttribute('id', id)
  return rootContainer
}

function addRootElement(rootElem: Node) {
  if (!document?.body?.lastElementChild) return
  document.body.insertBefore(
    rootElem,
    document.body.lastElementChild.nextElementSibling
  )
}

function usePortal(type?: string) {
  const __DORAI_PORTAL__ = `dorai-${type}` || 'dorai-portal'

  const rootElemRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(function setupElement() {
    if (!rootElemRef.current) return

    addRootElement(rootElemRef.current)

    return function removeElement() {
      rootElemRef.current && rootElemRef.current.remove()
    }
  }, [])

  function getRootElem() {
    if (!rootElemRef.current) {
      rootElemRef.current = createRootElement(__DORAI_PORTAL__)
    }
    return rootElemRef.current
  }

  return getRootElem()
}

export { usePortal }
