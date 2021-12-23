import React from 'react'
import { GetId } from '../../utils/get-id'
import { mergeRefs } from '../../utils/merge-ref'
// eslint-disable-next-line no-unused-vars
import type * as Polymorphic from '../../utils/polymophic'

/**
 *
 * Accessibility requirements
 * https://www.w3.org/TR/wai-aria-practices-1.2/#tabs
 *
 **/

/**
 *
 *
 * Tabs root component
 *
 *
 */

type TabsType = {
  children: React.ReactNode
  defaultIndex?: number
  manual?: boolean
  vertical?: boolean
}

type OrientationType = 'vertical' | 'horizontal'

const TabsContext = React.createContext<{
  tabs: React.MutableRefObject<HTMLElement | null>[]
  handleRegisterTab: (ref: React.MutableRefObject<HTMLElement | null>) => void
  panels: React.MutableRefObject<HTMLElement | null>[]
  handleRegisterPanel: (ref: React.MutableRefObject<HTMLElement | null>) => void
  activeTabIndex: number
  focusedTabIndex: number
  handleSetActiveTabIndex: (index: number) => void
  handleSetFocusedTabIndex: (index: number) => void
  orientation: OrientationType
  manual: boolean
} | null>(null)

const TabsRoot = ({
  children,
  defaultIndex = 0,
  manual = false,
  vertical
}: TabsType) => {
  const [activeTabIndex, setActiveTabIndex] =
    React.useState<number>(defaultIndex)
  const [focusedTabIndex, setFocusedTabIndex] =
    React.useState<number>(defaultIndex)
  React.useState<number>(defaultIndex)
  const [tabs, setTabs] = React.useState<
    React.MutableRefObject<HTMLElement | null>[]
  >([])
  const [panels, setPanels] = React.useState<
    React.MutableRefObject<HTMLElement | null>[]
  >([])

  const orientation: OrientationType = vertical ? 'vertical' : 'horizontal'

  const handleRegisterTab = React.useCallback(
    (element: React.MutableRefObject<HTMLElement | null>) => {
      if (!element) return
      setTabs((prev) => [...prev, element])

      return () =>
        setTabs((prev) => {
          return prev.filter((tab) => tab !== element)
        })
    },
    []
  )

  const handleRegisterPanel = React.useCallback(
    (element: React.MutableRefObject<HTMLElement | null>) => {
      if (!element) return
      setPanels((prev) => [...prev, element])

      return () =>
        setPanels((prev) => {
          return prev.filter((tab) => tab !== element)
        })
    },
    []
  )

  const handleSetFocusedTabIndex = React.useCallback(
    (index: number) => {
      setFocusedTabIndex(index)
      return tabs[index]?.current?.focus()
    },
    [tabs]
  )

  const handleSetActiveTabIndex = (index: number) => {
    setActiveTabIndex(index)
  }

  const context = React.useMemo(
    () => ({
      tabs,
      handleRegisterTab,
      panels,
      handleRegisterPanel,
      activeTabIndex,
      focusedTabIndex,
      handleSetActiveTabIndex,
      handleSetFocusedTabIndex,
      orientation,
      manual
    }),
    [
      tabs,
      handleRegisterTab,
      panels,
      handleRegisterPanel,
      activeTabIndex,
      focusedTabIndex,
      handleSetFocusedTabIndex,
      orientation,
      manual
    ]
  )

  return <TabsContext.Provider value={context}>{children}</TabsContext.Provider>
}

const useTabsValue = (component: string) => {
  const context = React.useContext(TabsContext)

  if (context === null) {
    throw new Error(
      `<Tabs.${component} /> component is not called within expected parent component`
    )
  }

  return context
}

/**
 *
 * Tab Button component
 *
 */
type TabOwnProps = {
  children: ((args: { active: boolean }) => JSX.Element) | React.ReactNode
  disabled?: boolean
}

type TabProps<C extends React.ElementType> = Polymorphic.ComponentPropsWithRef<
  C,
  TabOwnProps
>

const __DEFAULT_TAB_TAG__ = 'button'

type TabType = <C extends React.ElementType = typeof __DEFAULT_TAB_TAG__>(
  props: TabProps<C>
) => React.ReactElement | null

const TAB_DIRECTION = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight'
}

const TabTrigger: TabType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_TAB_TAG__>(
    { as, children, disabled, ...props }: TabProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const id = `dorai-ui-tab-${GetId()}`

    const internalRef = React.useRef<HTMLElement>(null)

    const mergedTabRef = mergeRefs([internalRef, ref])

    const {
      handleRegisterTab,
      activeTabIndex,
      focusedTabIndex,
      handleSetFocusedTabIndex,
      tabs,
      panels,
      orientation,
      handleSetActiveTabIndex,
      manual
    } = useTabsValue('Trigger')

    const tabIndex = tabs.indexOf(internalRef)
    const active = activeTabIndex === tabIndex

    React.useEffect(() => {
      handleRegisterTab(internalRef)
    }, [handleRegisterTab])

    const handleClickEvent = React.useCallback(() => {
      // update both the focus and active state
      handleSetFocusedTabIndex(tabIndex)
      handleSetActiveTabIndex(tabIndex)
    }, [handleSetFocusedTabIndex, tabIndex, handleSetActiveTabIndex])

    const handleTabSelect = React.useCallback(() => {
      handleSetActiveTabIndex(tabIndex)
    }, [handleSetActiveTabIndex, tabIndex])

    // credit to react-tabs for this simple approach
    const nextFocusable = React.useCallback(() => {
      const nextIndex = focusedTabIndex + 1
      for (let index = nextIndex; index < tabs.length; index++) {
        if (!tabs[index].current?.hasAttribute('disabled')) {
          return handleSetFocusedTabIndex(index)
        }
      }

      for (let index = 0; index < tabs.length; index++) {
        if (!tabs[index].current?.hasAttribute('disabled')) {
          return handleSetFocusedTabIndex(index)
        }
      }
    }, [focusedTabIndex, handleSetFocusedTabIndex, tabs])

    const previousFocusable = React.useCallback(() => {
      let prevIndex = focusedTabIndex

      while (prevIndex--) {
        if (!tabs[prevIndex]?.current?.hasAttribute('disabled')) {
          return handleSetFocusedTabIndex(prevIndex)
        }
      }

      let tabCount = tabs.length

      while (tabCount--) {
        if (!tabs[tabCount]?.current?.hasAttribute('disabled')) {
          return handleSetFocusedTabIndex(tabCount)
        }
      }
    }, [focusedTabIndex, handleSetFocusedTabIndex, tabs])

    const handleChange = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key !== 'Tab') event.preventDefault()

        if (event.key === ' ' || event.key === 'Enter') {
          handleSetActiveTabIndex(focusedTabIndex)
        }

        const direction =
          event.key === TAB_DIRECTION.ARROW_RIGHT ||
          event.key === TAB_DIRECTION.ARROW_DOWN
            ? 'right'
            : 'left'

        if (
          event.key === TAB_DIRECTION.ARROW_LEFT ||
          event.key === TAB_DIRECTION.ARROW_UP
        ) {
          if (direction === 'left') {
            return previousFocusable()
          }

          return nextFocusable()
        }

        if (
          event.key === TAB_DIRECTION.ARROW_RIGHT ||
          event.key === TAB_DIRECTION.ARROW_DOWN
        ) {
          if (direction === 'right') {
            return nextFocusable()
          }

          return previousFocusable()
        }
      },
      [
        focusedTabIndex,
        handleSetActiveTabIndex,
        nextFocusable,
        previousFocusable
      ]
    )

    const handleDirection = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key !== 'Tab') event.preventDefault()
        if (
          orientation !== 'vertical' &&
          (event.key === TAB_DIRECTION.ARROW_UP ||
            event.key === TAB_DIRECTION.ARROW_DOWN)
        )
          return

        if (
          orientation !== 'horizontal' &&
          (event.key === TAB_DIRECTION.ARROW_LEFT ||
            event.key === TAB_DIRECTION.ARROW_RIGHT)
        )
          return

        handleChange(event)
      },
      [handleChange, orientation]
    )

    const TagName = as || __DEFAULT_TAB_TAG__

    const render = () => {
      if (typeof children === 'function') {
        return children({ active })
      }

      return children
    }

    return (
      <TagName
        role='tab'
        id={id}
        onFocus={!manual ? handleTabSelect : undefined}
        onKeyDown={handleDirection}
        onClick={handleClickEvent}
        disabled={disabled}
        aria-controls={panels[tabIndex]?.current?.id}
        aria-selected={active}
        aria-readonly={disabled}
        tabIndex={active ? 0 : -1}
        {...props}
        ref={mergedTabRef}
      >
        {render()}
      </TagName>
    )
  }
)

/**
 *
 * Tab List component
 * https://www.w3.org/TR/wai-aria-1.2/#tablist
 *
 */
type TabListOwnProps = {
  children: React.ReactNode
}

type TabListProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, TabListOwnProps>

const __DEFAULT_TABLIST_TAG__ = 'div'

type TabListType = <
  C extends React.ElementType = typeof __DEFAULT_TABLIST_TAG__
>(
  props: TabListProps<C>
) => React.ReactElement | null

const List: TabListType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_TABLIST_TAG__>(
    { as, children, ...props }: TabListProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const { orientation } = useTabsValue('List')
    const TagName = as || __DEFAULT_TABLIST_TAG__
    return (
      <TagName
        {...props}
        role='tablist'
        aria-orientation={orientation}
        ref={ref}
      >
        {children}
      </TagName>
    )
  }
)

/**
 *
 * Tab Panel component
 * https://www.w3.org/TR/wai-aria-practices-1.2/#tabpanel
 *
 */
type TabPanelOwnProps = {
  children: React.ReactNode
}

type TabPanelProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, TabPanelOwnProps>

const __DEFAULT_TABPANEL_TAG__ = 'div'

type TabPanelType = <
  C extends React.ElementType = typeof __DEFAULT_TABPANEL_TAG__
>(
  props: TabPanelProps<C>
) => React.ReactElement | null

const Panel: TabPanelType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_TABPANEL_TAG__>(
    { as, children, ...props }: TabPanelProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const TagName = as || __DEFAULT_TABPANEL_TAG__

    const id = `dorai-ui-tab-panel-${GetId()}`

    const internalRef = React.useRef<HTMLElement>(null)

    const mergedPanelRef = mergeRefs([internalRef, ref])

    const { handleRegisterPanel, tabs, panels, activeTabIndex } =
      useTabsValue('Panel')

    React.useEffect(() => {
      handleRegisterPanel(internalRef)
    }, [handleRegisterPanel])

    const panelIndex = panels.indexOf(internalRef)
    const active = panelIndex === activeTabIndex

    return (
      <TagName
        role='tabpanel'
        id={id}
        {...props}
        ref={mergedPanelRef}
        aria-labelledby={tabs[panelIndex]?.current?.id}
        aria-selected={active}
        tabIndex={active ? 0 : -1}
      >
        {active ? children : null}
      </TagName>
    )
  }
)

export const Tabs = Object.assign(TabsRoot, {
  Trigger: TabTrigger,
  List,
  Panel
})
