import React from 'react'
import { GetId, Polymorphic } from '@dorai-ui/utils'

const DescriptionContext = React.createContext<{
  ids: string | undefined
  registerId: (value: string) => () => void
} | null>(null)

type DescriptionContextProps = {
  children: React.ReactNode
}

const DescriptionContextProvider = ({ children }: DescriptionContextProps) => {
  const [ids, setIds] = React.useState<string[]>([])

  const composeIds = ids.length > 0 ? ids.join(' ') : undefined

  const registerId = React.useCallback((value: string) => {
    setIds((idsSet) => [...idsSet, value])
    return () =>
      setIds((idsSet) => {
        return idsSet.filter((id) => id !== value)
      })
  }, [])

  const context = React.useMemo(
    () => ({ ids: composeIds, registerId }),
    [composeIds, registerId]
  )

  return (
    <DescriptionContext.Provider value={context}>
      {children}
    </DescriptionContext.Provider>
  )
}

const useDescriptionValue = () => {
  const context = React.useContext(DescriptionContext)

  if (context === null) {
    throw new Error(
      '<Description /> component is not called within expected parent component'
    )
  }

  return context
}

/**
 *
 *
 * Description component
 *
 *
 */
type DescriptionOwnProps = {
  children: React.ReactNode
}

type DescriptionProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, DescriptionOwnProps>

const __DEFAULT_DESCRIPTION_TAG__ = 'p'

type DescriptionType = <
  C extends React.ElementType = typeof __DEFAULT_DESCRIPTION_TAG__
>(
  props: DescriptionProps<C>
) => React.ReactElement | null

const Description: DescriptionType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_DESCRIPTION_TAG__>(
    { as, children, ...props }: DescriptionProps<C>,
    ref?: Polymorphic.Ref<C>
  ) => {
    const context = useDescriptionValue()

    const { registerId } = context

    const id = `dorai-ui-description-${GetId()}`

    React.useLayoutEffect(() => {
      return registerId(id)
    }, [id, registerId])

    const TagName = as || __DEFAULT_DESCRIPTION_TAG__
    return (
      <TagName id={id} ref={ref} {...props}>
        {children}
      </TagName>
    )
  }
)

export { Description, useDescriptionValue, DescriptionContextProvider }
