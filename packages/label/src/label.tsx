import React from 'react'
import { GetId } from '@dorai-ui/utils/get-id'
import * as Polymorphic from '@dorai-ui/utils/polymorphic'

const LabelContext = React.createContext<{
  ids: string | undefined
  registerId: (value: string) => () => void
  htmlFor: string | undefined
} | null>(null)

type LabelContextProps = {
  children: ((args: { ids?: string }) => JSX.Element) | React.ReactNode
  htmlFor?: string
}

const LabelContextProvider = ({ children, htmlFor }: LabelContextProps) => {
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
    () => ({ ids: composeIds, registerId, htmlFor }),
    [composeIds, htmlFor, registerId]
  )

  const render = () => {
    if (typeof children === 'function') {
      return children({ ids: composeIds })
    }

    return children
  }

  return (
    <LabelContext.Provider value={context}>{render()}</LabelContext.Provider>
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
 * Label component
 *
 */
type LabelOwnProps = {
  children: React.ReactNode
}

type LabelProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, LabelOwnProps>

const __DEFAULT_LABEL_TAG__ = 'label'

const Label = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_LABEL_TAG__>(
    { as, children, ...props }: LabelProps<C>,
    ref?: Polymorphic.Ref<C>
  ) => {
    const context = useLabelValue()

    const { registerId } = context

    const htmlFor = props.htmlFor || context.htmlFor

    const id = `dorai-ui-label-${GetId()}`

    React.useEffect(() => {
      return registerId(id)
    }, [id, registerId])

    const TagName = as || __DEFAULT_LABEL_TAG__
    return (
      <TagName id={id} ref={ref} {...props} htmlFor={htmlFor}>
        {children}
      </TagName>
    )
  }
)

export { Label, useLabelValue, LabelContextProvider }
