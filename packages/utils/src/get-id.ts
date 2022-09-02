import React from 'react'

let id = 0
const generateId = () => {
  return ++id
}

const GetId =
  React.useId ??
  function useId() {
    const isServerReady = useServerSideReadiness()
    const [id, setId] = React.useState<number | null>(
      isServerReady ? generateId : null
    )

    React.useLayoutEffect(() => {
      if (id) return
      const generated = generateId()

      setId(generated)
    }, [id])

    return id
  }

let isServerReady = false

function useServerSideReadiness() {
  const [serverIsReady, setServerIsReady] = React.useState(isServerReady)

  React.useEffect(() => {
    if (serverIsReady === true) return

    setServerIsReady(true)
  }, [serverIsReady])

  React.useEffect(() => {
    if (isServerReady === true) return

    isServerReady = true
  })

  return serverIsReady
}

export { GetId, generateId }
