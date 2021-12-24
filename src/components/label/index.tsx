import React from 'react'
import { GetId } from '../../utils/get-id'
// eslint-disable-next-line no-unused-vars
import type * as Polymorphic from '../../utils/polymophic'

const LabelContext = React.createContext<{
  ids: string | undefined
  registerId: (value: string) => () => void
} | null>(null)

type LabelContextProps = {
  children: React.ReactNode
}

const LabelContextProvider = ({ children }: LabelContextProps) => {
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
    <LabelContext.Provider value={context}>{children}</LabelContext.Provider>
  )
}

const useLabelValue = () => {
  const context = React.useContext(LabelContext)

  if (context === null) {
    throw new Error(
      '<Label /> component is not called within expected parent component'
    )
  }

  return context
}

/**
 *
 *
 * Label component
 *
 *
 */
type LabelOwnProps = {
  children: React.ReactNode
}

type LabelProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, LabelOwnProps>

const __DEFAULT_LABEL_TAG__ = 'label'

type LabelType = <C extends React.ElementType = typeof __DEFAULT_LABEL_TAG__>(
  props: LabelProps<C>
) => React.ReactElement | null

const Label: LabelType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_LABEL_TAG__>(
    { as, children, ...props }: LabelProps<C>,
    ref?: Polymorphic.Ref<C>
  ) => {
    const context = useLabelValue()

    const { registerId } = context

    const id = `dorai-ui-label-${GetId()}`

    React.useLayoutEffect(() => {
      return registerId(id)
    }, [id, registerId])

    const TagName = as || __DEFAULT_LABEL_TAG__
    return (
      <TagName id={id} ref={ref} {...props}>
        {children}
      </TagName>
    )
  }
)

export { Label, useLabelValue, LabelContextProvider }
