import React from 'react'

let id = 0
const generateId = () => {
  return ++id
}

const GetId = () => {
  const [id, setId] = React.useState<number>()
  React.useEffect(() => {
    const generated = generateId()

    setId(generated)
  }, [])

  return id
}

export { GetId, generateId }
