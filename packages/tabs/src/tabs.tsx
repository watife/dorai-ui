import React from 'react'

import { mergeRefs } from '@dorai-ui/utils/merge-refs'
import * as Polymorphic from '@dorai-ui/utils/polymorphic'
import { KeyBoardKeys } from '@dorai-ui/utils/keyboard'

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

type RootOwnProps = {
  children: React.ReactNode
  defaultIndex?: number
  manual?: boolean
  vertical?: boolean
}

type RootProps<C extends React.ElementType> = Polymorphic.ComponentPropsWithRef<
  C,
  RootOwnProps
>

const __DEFAULT_ROOT_TAG__ = 'div'

type RootType = <C extends React.ElementType = typeof __DEFAULT_ROOT_TAG__>(
  props: RootProps<C>
) => React.ReactElement | null

const TabsRoot: RootType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_ROOT_TAG__>(
    {
      as,
      children,
      defaultIndex = 0,
      manual = false,
      vertical,
      ...props
    }: RootProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const [activeTabIndex, setActiveTabIndex] =
      React.useState<number>(defaultIndex)
    const [focusedTabIndex, setFocusedTabIndex] =
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

    const nextFocuableTab = React.useCallback(
      (initialIndex: number) => {
        for (let index = initialIndex; index < tabs.length; index++) {
          if (!tabs[index].current?.hasAttribute('disabled')) {
            handleSetFocusedTabIndex(index)
            handleSetActiveTabIndex(index)
            break
          }
        }
      },
      [handleSetFocusedTabIndex, tabs]
    )

    // Handle Default Index
    React.useEffect(() => {
      if (!tabs.length) return
      /**
       * If the default index passed is not existing, look for the next focusable from 0
       */
      if (!tabs[defaultIndex]) {
        nextFocuableTab(0)
        console.warn(
          `
          /**
           * 
           * Dorai-ui Warning
           * 
           */

          The default index (${defaultIndex}) passed doesn't match any of the Tab Trigger index (starting from 0); hence focus is set to the next focusable tab trigger
          `
        )
        return
      }

      /**
       * If the default index passed is disabled, set the next focuable element with a warning
       */
      if (tabs[defaultIndex]?.current?.hasAttribute('disabled')) {
        nextFocuableTab(defaultIndex)
        console.warn(
          `
          /**
           * 
           * Dorai-ui Warning
           * 
           */
          The defaultIndex (${defaultIndex}) passed belongs to a disabled tab trigger; hence focus is automatically moved to the next focusable tab trigger
          `
        )
      }
    }, [defaultIndex, handleSetFocusedTabIndex, nextFocuableTab, tabs])

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

    const TagName = as || __DEFAULT_ROOT_TAG__

    return (
      <TabsContext.Provider value={context}>
        <TagName ref={ref} {...props}>
          {children}
        </TagName>
      </TabsContext.Provider>
    )
  }
)

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

const Trigger: TabType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_TAB_TAG__>(
    { as, children, disabled, ...props }: TabProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const id = `dorai-ui-tab-${React.useId()}`

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
        if (
          event.key === KeyBoardKeys.Space ||
          event.key === KeyBoardKeys.Enter
        ) {
          handleSetActiveTabIndex(focusedTabIndex)
        }

        if (
          event.key === KeyBoardKeys.ArrowLeft ||
          event.key === KeyBoardKeys.ArrowUp
        ) {
          return previousFocusable()
        }

        if (
          event.key === KeyBoardKeys.ArrowRight ||
          event.key === KeyBoardKeys.ArrowDown
        ) {
          return nextFocusable()
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
        if (
          orientation !== 'vertical' &&
          (event.key === KeyBoardKeys.ArrowUp ||
            event.key === KeyBoardKeys.ArrowDown)
        )
          return

        if (
          orientation !== 'horizontal' &&
          (event.key === KeyBoardKeys.ArrowLeft ||
            event.key === KeyBoardKeys.ArrowRight)
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

    const id = `dorai-ui-tab-panel-${React.useId()}`

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
        hidden={!active}
        ref={mergedPanelRef}
        aria-labelledby={tabs[panelIndex]?.current?.id}
        tabIndex={active ? 0 : -1}
        {...props}
      >
        {children}
      </TagName>
    )
  }
)

export const Tabs = Object.assign(TabsRoot, {
  Trigger,
  List,
  Panel
})
