import React from 'react'

import { GetId } from './get-id'

const MakeIdContext = React.createContext<{
  ids: Record<string, string>
  registerId: (id: string) => void
} | null>(null)

const MakeIdProvider = ({
  children,
  id: labelId
}: {
  id: string
  children: React.ReactNode
}) => {
  const [ids, registerNewId] = React.useState<Record<string, string>>({})

  const registerId = React.useCallback(
    (newId: string) => {
      const id = `dorai-ui-${labelId}-${GetId()}`
      registerNewId({ [newId]: id })
    },
    [labelId]
  )

  const context = React.useMemo(
    () => ({
      ids,
      registerId
    }),
    [ids, registerId]
  )
  return (
    <MakeIdContext.Provider value={context}>{children}</MakeIdContext.Provider>
  )
}

const useMakeIdValue = () => {
  const context = React.useContext(MakeIdContext)

  if (context === null) {
    throw new Error(`component is not called within expected parent component`)
  }

  return context
}

export { MakeIdProvider, useMakeIdValue }
