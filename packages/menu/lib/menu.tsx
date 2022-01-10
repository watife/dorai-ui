import React from 'react'
import {
  callAll,
  GetId,
  KeyBoardKeys,
  mergeRefs,
  Polymorphic
} from '@dorai-ui/utils'

type MenuType = {
  active?: boolean
  setIsActive?: () => void
  children: ((args: { active: boolean }) => JSX.Element) | React.ReactNode
}

const MenuContext = React.createContext<{
  active: boolean
  activeIndex: number | null
  handleSetIsOpen: () => void
  handleSetActiveIndex: (index: number) => void
  menuButtonRef: React.RefObject<HTMLElement>
  menuListRef: React.RefObject<HTMLElement>
  menuItems: React.RefObject<HTMLElement>[]
  handleRegisterMenuItems: (element: React.RefObject<HTMLElement>) => void
  initialFocus?: React.MutableRefObject<HTMLElement | null>
} | null>(null)

const MenuRoot = ({ active, children, setIsActive }: MenuType) => {
  const [isActiveControlled, setIsActiveControlled] =
    React.useState<boolean>(false)
  const [menuItems, registerMenuItems] = React.useState<
    Array<React.RefObject<HTMLElement>>
  >([])
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  const handleRegisterMenuItems = React.useCallback(
    (element: React.RefObject<HTMLElement>) => {
      registerMenuItems((prev) => [...prev, element])

      return () => {
        registerMenuItems((prev) => {
          return prev.filter((item) => item !== element)
        })
      }
    },
    []
  )

  const handleSetActiveIndex = React.useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const menuButtonRef = React.useRef<HTMLElement>(null)
  const menuListRef = React.useRef<HTMLElement>(null)

  const controlToCall = React.useCallback(() => {
    setIsActive ? setIsActive() : setIsActiveControlled((prev) => !prev)
  }, [setIsActive])

  const handleSetIsOpen = React.useCallback(() => {
    if (active || isActiveControlled) {
      menuButtonRef?.current?.focus()
    }

    controlToCall()
  }, [active, controlToCall, isActiveControlled])

  const handleOutsideClick = React.useCallback(() => {
    if (!active || !isActiveControlled) return
    handleSetIsOpen()
  }, [active, handleSetIsOpen, isActiveControlled])

  React.useEffect(() => {
    window.addEventListener('mousedown', () => {
      console.log(isActiveControlled)

      handleOutsideClick()
    })

    return () => {
      window.removeEventListener('keydown', () => {
        handleOutsideClick()
      })
    }
  }, [handleOutsideClick, isActiveControlled])

  const context = React.useMemo(
    () => ({
      active: active || isActiveControlled,
      handleSetIsOpen,
      activeIndex,
      handleSetActiveIndex,
      menuButtonRef,
      handleRegisterMenuItems,
      menuListRef,
      menuItems
    }),
    [
      active,
      activeIndex,
      handleRegisterMenuItems,
      handleSetActiveIndex,
      handleSetIsOpen,
      isActiveControlled,
      menuItems
    ]
  )

  const render = () => {
    if (typeof children === 'function') {
      return children({ active: active || isActiveControlled })
    }

    return children
  }

  return <MenuContext.Provider value={context}>{render()}</MenuContext.Provider>
}

const useMenuContext = (component: string) => {
  const context = React.useContext(MenuContext)

  if (context === null) {
    throw new Error(
      `<Menu.${component} /> component is not called within expected parent component`
    )
  }

  return context
}

/**
 *
 * Menu Trigger component for opening menu component
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
    ref: Polymorphic.Ref<C>
  ) => {
    const { active, menuButtonRef, handleSetIsOpen, menuListRef } =
      useMenuContext('Trigger')

    const mergedRef = mergeRefs([menuButtonRef, ref])

    const id = `dorai-ui-tab-${GetId()}`

    const TagName = as || __DEFAULT_TRIGGER_TAG__

    const handleClicks = callAll(props.onClick, handleSetIsOpen)

    const propsHandled = {
      ...props,
      onClick: handleClicks
    }

    return (
      <TagName
        {...propsHandled}
        id={id}
        ref={mergedRef}
        aria-haspopup={true}
        aria-controls={menuListRef?.current?.id}
        aria-expanded={active}
      >
        {children}
      </TagName>
    )
  }
)

/**
 *
 * Menu List component
 *
 */
type ListOwnProps = {
  children: React.ReactNode
}

type ListProps<C extends React.ElementType> = Polymorphic.ComponentPropsWithRef<
  C,
  ListOwnProps
>

const __DEFAULT_LIST_TAG__ = 'ul'

type ListType = <C extends React.ElementType = typeof __DEFAULT_LIST_TAG__>(
  props: ListProps<C>
) => React.ReactElement | null
const List: ListType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_LIST_TAG__>(
    { as, children, ...props }: ListProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const {
      active,
      menuButtonRef,
      handleSetIsOpen,
      menuListRef,
      menuItems,
      handleSetActiveIndex
    } = useMenuContext('List')

    const focusableElements = React.useMemo(
      () =>
        menuItems.filter((item) => !item?.current?.hasAttribute('disabled')),
      [menuItems]
    )

    React.useEffect(() => {
      if (!active) return
      handleSetActiveIndex(0)
      focusableElements[0]?.current?.focus()
    }, [active, focusableElements, handleSetActiveIndex, menuItems])

    const mergedRef = mergeRefs([menuListRef, ref])

    const id = `dorai-ui-tab-${GetId()}`

    const TagName = as || __DEFAULT_LIST_TAG__

    const handleClicks = callAll(props.onClick, handleSetIsOpen)

    const propsHandled = {
      ...props,
      onClick: handleClicks
    }

    return (
      <TagName
        {...propsHandled}
        role='menu'
        hidden={!active}
        tabIndex={-1}
        id={id}
        ref={mergedRef}
        aria-labelledby={menuButtonRef?.current?.id}
      >
        {children}
      </TagName>
    )
  }
)

/**
 *
 * Menu Item component for opening menu component
 *
 */
type ItemOwnProps = {
  children: React.ReactNode
  disabled?: boolean
}

type ItemProps<C extends React.ElementType> = Polymorphic.ComponentPropsWithRef<
  C,
  ItemOwnProps
>

const __DEFAULT_ITEM_TAG__ = 'li'

type ItemType = <C extends React.ElementType = typeof __DEFAULT_ITEM_TAG__>(
  props: ItemProps<C>
) => React.ReactElement | null

const Item: ItemType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_ITEM_TAG__>(
    { as, children, disabled = false, ...props }: ItemProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const internalRef = React.useRef<HTMLElement>(null)

    const {
      activeIndex,
      handleSetActiveIndex,
      menuItems,
      handleSetIsOpen,
      handleRegisterMenuItems
    } = useMenuContext('Item')

    const mergedRef = mergeRefs([internalRef, ref])

    const id = `dorai-ui-tab-${GetId()}`

    React.useEffect(() => {
      handleRegisterMenuItems(internalRef)
    }, [handleRegisterMenuItems])

    const focusableElements = menuItems.filter(
      (item) => !item?.current?.hasAttribute('disabled')
    )

    const lastFocusableItem = focusableElements[focusableElements.length - 1]
    const firstFocusableItem = focusableElements[0]

    const nextFocusableElement = (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.target === lastFocusableItem?.current) {
        handleSetActiveIndex(0)
        return firstFocusableItem?.current?.focus()
      }

      const nextIndex = focusableElements.indexOf(internalRef) + 1

      handleSetActiveIndex(nextIndex)
      focusableElements[nextIndex]?.current?.focus()
    }

    const prevFocusableElement = (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.target === firstFocusableItem.current) {
        handleSetActiveIndex(focusableElements.length - 1)
        return lastFocusableItem?.current?.focus()
      }

      const nextIndex = focusableElements.indexOf(internalRef) - 1

      handleSetActiveIndex(nextIndex)

      focusableElements[nextIndex]?.current?.focus()
    }

    const eventTriggers: Record<
      string,
      (event: React.KeyboardEvent<HTMLElement>) => void
    > = {
      [KeyBoardKeys.ArrowDown]: nextFocusableElement,
      [KeyBoardKeys.Down]: nextFocusableElement,
      [KeyBoardKeys.ArrowUp]: prevFocusableElement,
      [KeyBoardKeys.Up]: prevFocusableElement
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
      event.preventDefault()
      const nextFocusTrigger = eventTriggers[event.key]

      if (!nextFocusTrigger) return handleSetIsOpen()

      nextFocusTrigger(event)
    }

    const TagName = as || __DEFAULT_ITEM_TAG__

    const handleClicks = callAll(props.onClick, handleSetIsOpen)

    const propsHandled = {
      ...props,
      onClick: handleClicks
    }

    const activeMenu = focusableElements.indexOf(internalRef) === activeIndex

    return (
      <TagName
        disabled={disabled}
        tabIndex={activeMenu ? 0 : -1}
        id={id}
        onKeyDown={handleKeyPress}
        ref={mergedRef}
        {...propsHandled}
      >
        {children}
      </TagName>
    )
  }
)

/**
 *
 * SubMenu component houses
 *
 */
// const SubMenu =

export const Menu = Object.assign(MenuRoot, { Trigger, List, Item })
