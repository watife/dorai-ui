import React from 'react'
import { KeyBoardKeys } from '../../enums/keyboard'
import { callAll } from '../../utils/call-all'
import { GetId } from '../../utils/get-id'
import { mergeRefs } from '../../utils/merge-ref'
import type * as Polymorphic from '../../utils/polymophic'

const AccordionContext = React.createContext<{
  accordions: React.MutableRefObject<HTMLElement | null>[]
  activeAccordion: React.MutableRefObject<HTMLElement | null> | undefined
  handleRegisterAccordion: (
    element: React.MutableRefObject<HTMLElement | null>
  ) => void
  handleSetGlobalActiveAccordion: (
    element: React.MutableRefObject<HTMLElement | null>
  ) => void
  defaultIndex?: number
  type?: 'single' | 'multiple'
} | null>(null)

type AccordionType = {
  children: React.ReactNode
  type?: 'single' | 'multiple'
  defaultIndex?: number
}

const Root = ({ children, type = 'multiple', defaultIndex }: AccordionType) => {
  const [accordions, registerAccordions] = React.useState<
    React.MutableRefObject<HTMLElement | null>[]
  >([])
  const [activeAccordion, setGlobalActiveAccordion] =
    React.useState<React.MutableRefObject<HTMLElement | null>>()

  // handle defaultIndex
  React.useEffect(() => {
    if (!defaultIndex) return
    const accordionToBeDefault = accordions[defaultIndex]
    setGlobalActiveAccordion(accordionToBeDefault)
  }, [accordions, defaultIndex])

  const handleRegisterAccordion = React.useCallback(
    (element: React.MutableRefObject<HTMLElement | null>) => {
      registerAccordions((prev) => [...prev, element])
    },
    []
  )

  const handleSetGlobalActiveAccordion = React.useCallback(
    (element: React.MutableRefObject<HTMLElement | null>) => {
      if (type === 'multiple') return
      setGlobalActiveAccordion(element)
    },
    [type]
  )

  const context = React.useMemo(
    () => ({
      accordions,
      activeAccordion,
      handleRegisterAccordion,
      handleSetGlobalActiveAccordion,
      defaultIndex,
      type
    }),
    [
      accordions,
      activeAccordion,
      defaultIndex,
      type,
      handleRegisterAccordion,
      handleSetGlobalActiveAccordion
    ]
  )

  return (
    <AccordionContext.Provider value={context}>
      {children}
    </AccordionContext.Provider>
  )
}

const useRootValue = (component: string) => {
  const context = React.useContext(AccordionContext)

  if (context === null) {
    throw new Error(
      `<Accordion.${component} /> component is not called within expected parent component`
    )
  }

  return context
}

/**
 *
 * Accordion Group component
 *
 */

const GroupContext = React.createContext<{
  handleSetGroupState: () => void
  handleSetContentIds: (id: string, type: 'panelId' | 'triggerId') => void
  contentIds: {
    panelId: string | null
    triggerId: string | null
  }
  open: boolean
  groupRef: React.MutableRefObject<HTMLElement | null>
} | null>(null)

const useGroupValue = (component: string) => {
  const context = React.useContext(GroupContext)

  if (context === null) {
    throw new Error(
      `<Accordion.${component} /> component is not called within expected parent component`
    )
  }

  return context
}

type GroupOwnProps = {
  children: ((args: { open: boolean }) => JSX.Element) | React.ReactNode
}

type GroupProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, GroupOwnProps>

const __DEFAULT_GROUP_TAG__ = 'div'

type GroupType = <C extends React.ElementType = typeof __DEFAULT_GROUP_TAG__>(
  props: GroupProps<C>
) => React.ReactElement | null

const Group: GroupType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_GROUP_TAG__>(
    { as, children, ...props }: GroupProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const internalRef = React.useRef<HTMLElement | null>(null)
    const [open, setOpen] = React.useState(false)
    const [contentIds, setContentIds] = React.useState<{
      panelId: string | null
      triggerId: string | null
    }>({ panelId: null, triggerId: null })

    const {
      handleRegisterAccordion,
      accordions,
      defaultIndex,
      type,
      activeAccordion
    } = useRootValue('Group')

    React.useEffect(() => {
      handleRegisterAccordion(internalRef)
    }, [handleRegisterAccordion])

    // handle default value and if it is type single, the next useEffect handles it
    React.useEffect(() => {
      if (type === 'single') return
      const currentState = internalRef === activeAccordion

      setOpen(currentState)
    }, [activeAccordion, type])

    // handle type of accordion and also defaultIndex if type is single
    React.useEffect(() => {
      if (type === 'multiple') return

      const currentState = internalRef === activeAccordion

      setOpen(currentState)
    }, [accordions, activeAccordion, defaultIndex, type])

    const mergedRef = mergeRefs([internalRef, ref])

    const handleSetGroupState = React.useCallback(() => {
      return setOpen((prev) => !prev)
    }, [])

    const handleSetContentIds = React.useCallback(
      (id: string, type: 'panelId' | 'triggerId') => {
        setContentIds((prev) => {
          return { ...prev, [type]: id }
        })
      },
      []
    )

    const render = () => {
      if (typeof children === 'function') {
        return children({ open })
      }

      return children
    }

    const TagName = as || __DEFAULT_GROUP_TAG__

    const context = React.useMemo(
      () => ({
        handleSetGroupState,
        open,
        handleSetContentIds,
        contentIds,
        groupRef: internalRef
      }),
      [handleSetGroupState, open, handleSetContentIds, contentIds]
    )

    return (
      <GroupContext.Provider value={context}>
        <TagName {...props} ref={mergedRef}>
          {render()}
        </TagName>
      </GroupContext.Provider>
    )
  }
)

/**
 *
 * Accordion Trigger component
 *
 */

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
    ref?: Polymorphic.Ref<C>
  ) => {
    const TagName = as || __DEFAULT_TRIGGER_TAG__

    const id = `dorai-ui-accordion-trigger-${GetId()}`

    const {
      handleSetGroupState,
      open,
      handleSetContentIds,
      contentIds,
      groupRef
    } = useGroupValue('Trigger')

    const { handleSetGlobalActiveAccordion } = useRootValue('Group')

    React.useEffect(() => {
      handleSetContentIds(id, 'triggerId')
    }, [handleSetContentIds, id])

    const handleClickEvent = callAll(
      () => props.onClick,
      () => handleSetGlobalActiveAccordion(groupRef),
      () => handleSetGroupState()
    )

    const handleKeyEvent = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        if (
          event.key !== KeyBoardKeys.Space &&
          event.key !== KeyBoardKeys.Enter
        )
          return

        event.preventDefault()

        return handleClickEvent()
      },
      [handleClickEvent]
    )

    return (
      <TagName
        aria-expanded={open}
        aria-controls={contentIds?.panelId || undefined}
        onClick={handleClickEvent}
        onKeyDown={(event) => handleKeyEvent(event)}
        {...props}
        ref={ref}
      >
        {children}
      </TagName>
    )
  }
)

/**
 *
 * Accordion Header component
 *
 */

type HeaderOwnProps = {
  children: React.ReactNode
}

type HeaderProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, HeaderOwnProps>

const __DEFAULT_HEADER_TAG__ = 'h3'

type HeaderType = <C extends React.ElementType = typeof __DEFAULT_HEADER_TAG__>(
  props: HeaderProps<C>
) => React.ReactElement | null

const Header: HeaderType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_HEADER_TAG__>(
    { as, children, ...props }: GroupProps<C>,
    ref?: Polymorphic.Ref<C>
  ) => {
    const TagName = as || __DEFAULT_HEADER_TAG__

    return (
      <TagName {...props} ref={ref}>
        {children}
      </TagName>
    )
  }
)

/**
 *
 * Accordion Panel component
 *
 */

type PanelOwnProps = {
  children: React.ReactNode
  fixed?: boolean
}

type PanelProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, PanelOwnProps>

const __DEFAULT_PANEL_TAG__ = 'div'

type PanelType = <C extends React.ElementType = typeof __DEFAULT_PANEL_TAG__>(
  props: PanelProps<C>
) => React.ReactElement | null

const Panel: PanelType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_PANEL_TAG__>(
    { as, children, fixed, ...props }: PanelProps<C>,
    ref?: Polymorphic.Ref<C>
  ) => {
    const TagName = as || __DEFAULT_PANEL_TAG__

    const id = `dorai-ui-accordion-panel-${GetId()}`

    const { open, handleSetContentIds, contentIds } = useGroupValue('Trigger')

    React.useEffect(() => {
      handleSetContentIds(id, 'panelId')
    }, [handleSetContentIds, id])

    if (!open && !fixed) return null

    return (
      <TagName
        aria-labelledby={contentIds?.triggerId || undefined}
        {...props}
        ref={ref}
      >
        {children}
      </TagName>
    )
  }
)

export const Accordion = Object.assign(Root, { Group, Header, Trigger, Panel })
