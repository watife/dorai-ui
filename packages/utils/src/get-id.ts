import React from 'react'

let id = 0
const generateId = () => {
  return ++id
}

const GetId = () => {
  const [id, setId] = React.useState<number | null>(generateId)
  React.useEffect(() => {
    if (id) return
    const generated = generateId()

    setId(generated)
  }, [id])

  return id
}

export { GetId, generateId }
