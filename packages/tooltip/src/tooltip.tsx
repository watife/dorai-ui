import { DoraiPortal } from '@dorai-ui/portal'
import { GetId } from '@dorai-ui/utils/get-id'
import * as Polymorphic from '@dorai-ui/utils/polymorphic'
import React from 'react'

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

const RootContext = React.createContext<{
  isActive: boolean
  handleToggleState: (toggleState: boolean) => void
} | null>(null)
/**
 *
 *  Root composes the other components
 *
 */
type RootOwnProps = {
  children: React.ReactNode
}
type RootProps<C extends React.ElementType> = Polymorphic.ComponentPropsWithRef<
  C,
  RootOwnProps
>

const __DEFAULT_ROOT_TAG__ = 'div'

type RootType = <C extends React.ElementType = typeof __DEFAULT_ROOT_TAG__>(
  props: RootProps<C>
) => React.ReactElement | null

const Root: RootType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_ROOT_TAG__>(
    { as, children, ...props }: RootProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const [isActive, setIsActive] = React.useState(false)

    const TagName = as || __DEFAULT_ROOT_TAG__

    const handleToggleState = (toggleState: boolean) => {
      return setIsActive(toggleState)
    }

    const context = React.useMemo(
      () => ({
        isActive,
        handleToggleState
      }),
      [isActive]
    )

    return (
      <RootContext.Provider value={context}>
        <MakeIdProvider id='tooltip'>
          <TagName {...props} ref={ref}>
            {children}
          </TagName>
        </MakeIdProvider>
      </RootContext.Provider>
    )
  }
)

const useRootValue = (component: string) => {
  const context = React.useContext(RootContext)

  if (context === null) {
    throw new Error(
      `<Tooltip.${component} /> component is not called within expected parent component`
    )
  }

  return context
}

type TriggerOwnProps = {
  children: React.ReactNode
}
type TriggerProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, TriggerOwnProps>

const __DEFAULT_TRIGGER_TAG__ = 'button'

type TriggerType = <
  C extends React.ElementType = typeof __DEFAULT_TRIGGER_TAG__
>(
  props: TriggerProps<C>
) => React.ReactElement | null

const Trigger: TriggerType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_TRIGGER_TAG__>(
    { as, children, ...props }: TriggerProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const { isActive, handleToggleState } = useRootValue('Trigger')
    const { ids } = useMakeIdValue()

    const TagName = as || __DEFAULT_TRIGGER_TAG__

    return (
      <TagName
        {...props}
        ref={ref}
        onFocus={() => handleToggleState(true)}
        onMouseEnter={() => handleToggleState(true)}
        onMouseLeave={() => handleToggleState(false)}
        onBlur={() => handleToggleState(false)}
        aria-describedby={isActive ? ids['content'] : ''}
      >
        {children}
      </TagName>
    )
  }
)

type ContentOwnProps = {
  children: React.ReactNode
}
type ContentProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, ContentOwnProps>

const __DEFAULT_CONTENT_TAG__ = 'span'

type ContentType = <
  C extends React.ElementType = typeof __DEFAULT_CONTENT_TAG__
>(
  props: ContentProps<C>
) => React.ReactElement | null

const Content: ContentType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_CONTENT_TAG__>(
    { as, children, ...props }: ContentProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const { isActive } = useRootValue('Content')
    const { ids } = useMakeIdValue()

    const TagName = as || __DEFAULT_CONTENT_TAG__

    return (
      <>
        {isActive ? (
          <DoraiPortal id='tooltip'>
            <TagName {...props} ref={ref} id={ids['content']}>
              {children}
            </TagName>
          </DoraiPortal>
        ) : null}
      </>
    )
  }
)

export const Tooltip = Object.assign(Root, { Trigger, Content })
