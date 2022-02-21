import React from 'react'
import { KeyBoardKeys, mergeRefs, Polymorphic } from '@dorai-ui/utils'
import { LabelContextProvider, useLabelValue, Label } from '@dorai-ui/label'

/**
 * Radio Group context
 */
const RootContext = React.createContext<{
  ids: string | undefined
  options: React.MutableRefObject<HTMLElement | null>[]
  checkedOption: React.MutableRefObject<HTMLElement | null> | null
  activeOption: React.MutableRefObject<HTMLElement | null> | null
  value: string
  onChange: (value: string) => void
  handleRegisterOptions: (
    element: React.MutableRefObject<HTMLElement | null>
  ) => void
  handleSetActiveOption: (
    element: React.MutableRefObject<HTMLElement | null>
  ) => void
  handleSetCheckedOption: (
    element: React.MutableRefObject<HTMLElement | null>
  ) => void
} | null>(null)

type Arguments = {
  ids: string | undefined
}

type RootType = {
  children: ((args: Arguments) => JSX.Element) | React.ReactNode
  value: string
  onChange: (value: string) => void
}

const Root = ({ children, value, onChange }: RootType) => {
  const [options, registerOptions] = React.useState<
    React.MutableRefObject<HTMLElement | null>[]
  >([])

  const { ids } = useLabelValue()

  /**
   * active option holds the active but not checked option (focus states)
   */
  const [activeOption, setActiveOption] =
    React.useState<React.MutableRefObject<HTMLElement | null> | null>(null)

  /**
   * checked option holds the checked option
   */
  const [checkedOption, setCheckedOption] =
    React.useState<React.MutableRefObject<HTMLElement | null> | null>(null)

  const handleRegisterOptions = React.useCallback(
    (element: React.MutableRefObject<HTMLElement | null>) => {
      registerOptions((prev) => [...prev, element])
    },
    []
  )

  const handleSetActiveOption = React.useCallback(
    (element: React.MutableRefObject<HTMLElement | null>) => {
      element?.current?.focus()
      setActiveOption(element)
    },
    []
  )

  const handleSetCheckedOption = React.useCallback(
    (element: React.MutableRefObject<HTMLElement | null>) => {
      const newValue = element?.current?.getAttribute('data-value')
      if (!newValue) return
      onChange(newValue)
      setCheckedOption(element)
    },
    [onChange]
  )

  const context = React.useMemo(
    () => ({
      value,
      onChange,
      options,
      activeOption,
      checkedOption,
      handleRegisterOptions,
      handleSetActiveOption,
      handleSetCheckedOption,
      ids
    }),
    [
      activeOption,
      checkedOption,
      handleRegisterOptions,
      handleSetActiveOption,
      handleSetCheckedOption,
      ids,
      onChange,
      options,
      value
    ]
  )

  const render = () => {
    if (typeof children === 'function') {
      return children({ ids })
    }

    return children
  }

  return <RootContext.Provider value={context}>{render()}</RootContext.Provider>
}

const useRadioRootContext = (component: string) => {
  const context = React.useContext(RootContext)

  if (context === null) {
    throw new Error(
      `<RadioGroup.${component} /> component is not called within expected parent component`
    )
  }

  return context
}

/**
 *
 * Radio Group component
 *
 */
type GroupOwnProps = {
  children: React.ReactNode
  value: string
  onChange: (value: string) => void
}

type GroupProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, GroupOwnProps>

const __DEFAULT_GROUP_TAG__ = 'div'

type GroupType = <C extends React.ElementType = typeof __DEFAULT_GROUP_TAG__>(
  props: GroupProps<C>
) => React.ReactElement | null

const Group: GroupType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_GROUP_TAG__>(
    { as, children, value, onChange, ...props }: GroupProps<C>,
    ref?: Polymorphic.Ref<C>
  ) => {
    const TagName = as || __DEFAULT_GROUP_TAG__

    return (
      <LabelContextProvider>
        {({ ids }) => (
          <Root value={value} onChange={onChange}>
            <TagName
              role='radiogroup'
              aria-labelledby={ids}
              ref={ref}
              {...props}
            >
              {children}
            </TagName>
          </Root>
        )}
      </LabelContextProvider>
    )
  }
)

/**
 *
 * Radio Option component
 *
 */
const OptionContext = React.createContext<{ checked: boolean } | null>(null)

type OptionOwnProps = {
  children:
    | ((args: { active: boolean; checked: boolean }) => JSX.Element)
    | React.ReactNode
  value: unknown
  disabled?: boolean
}

type OptionProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, OptionOwnProps>

const __DEFAULT_OPTION_TAG__ = 'div'

type OptionType = <C extends React.ElementType = typeof __DEFAULT_OPTION_TAG__>(
  props: OptionProps<C>
) => React.ReactElement | null

const Option: OptionType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_OPTION_TAG__>(
    { as, children, disabled, value: optionValue, ...props }: OptionProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const internalRef = React.useRef<HTMLElement | null>(null)
    const mergedRefs = mergeRefs([internalRef, ref])

    const {
      options,
      handleSetActiveOption,
      handleRegisterOptions,
      value: propsValue,
      handleSetCheckedOption,
      activeOption,
      checkedOption
    } = useRadioRootContext('Option')

    React.useEffect(() => {
      handleRegisterOptions(internalRef)
    }, [handleRegisterOptions])

    const focusableElements = options.filter(
      (option) => !option?.current?.hasAttribute('aria-disabled')
    )

    const lastFocusableItem = focusableElements[focusableElements.length - 1]
    const firstFocusableItem = focusableElements[0]

    const nextCheckedElement = (event: React.KeyboardEvent<HTMLElement>) => {
      event.preventDefault()
      if (event.target === lastFocusableItem?.current) {
        handleSetCheckedOption(focusableElements[0])
        return firstFocusableItem?.current?.focus()
      }

      const nextIndex = focusableElements.indexOf(internalRef) + 1

      handleSetCheckedOption(focusableElements[nextIndex])
      focusableElements[nextIndex]?.current?.focus()
    }

    const prevCheckedElement = (event: React.KeyboardEvent<HTMLElement>) => {
      event.preventDefault()
      if (event.target === firstFocusableItem.current) {
        handleSetCheckedOption(focusableElements[focusableElements.length - 1])
        return lastFocusableItem?.current?.focus()
      }

      const nextIndex = focusableElements.indexOf(internalRef) - 1

      handleSetCheckedOption(focusableElements[nextIndex])

      focusableElements[nextIndex]?.current?.focus()
    }

    const handleBlurOption = React.useCallback(() => {
      return internalRef?.current?.blur()
    }, [])

    const handleClickEvent = (
      event: React.MouseEvent | React.KeyboardEvent
    ) => {
      event.preventDefault()

      handleSetCheckedOption(internalRef)
      return
    }

    const eventTriggers: Record<
      string,
      (event: React.KeyboardEvent<HTMLElement>) => void
    > = {
      [KeyBoardKeys.ArrowDown]: nextCheckedElement,
      [KeyBoardKeys.ArrowUp]: prevCheckedElement,
      [KeyBoardKeys.Enter]: handleClickEvent,
      [KeyBoardKeys.Space]: handleClickEvent
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLElement>) => {
      event.preventDefault()
      const nextFocusTrigger = eventTriggers[event.key]

      if (!nextFocusTrigger) return

      nextFocusTrigger(event)
    }

    const TagName = as || __DEFAULT_OPTION_TAG__

    const dataValue = internalRef?.current?.getAttribute('data-value')

    const checked = !!(propsValue?.length && propsValue === dataValue)

    const render = () => {
      if (typeof children === 'function') {
        return children({
          checked: checked ? true : false,
          active: activeOption === internalRef
        })
      }

      return children
    }

    const getTabIndex = () => {
      if (checked || (!checkedOption && internalRef === firstFocusableItem)) {
        return 0
      }

      return -1
    }

    return (
      <OptionContext.Provider value={{ checked }}>
        <TagName
          role='radio'
          onClick={!disabled ? handleClickEvent : undefined}
          onKeyDown={handleKeyPress}
          aria-checked={checked ? true : false}
          value={optionValue}
          data-value={optionValue}
          onFocus={
            !disabled ? () => handleSetActiveOption(internalRef) : undefined
          }
          onBlur={!disabled ? () => handleBlurOption() : undefined}
          tabIndex={getTabIndex()}
          aria-disabled={disabled}
          ref={mergedRefs}
          {...props}
        >
          {render()}
        </TagName>
      </OptionContext.Provider>
    )
  }
)

const useOptionContext = (component: string) => {
  const context = React.useContext(OptionContext)

  if (context === null) {
    throw new Error(
      `<RadioGroup.${component} /> component is not called within <RadioGroup.Option /> component`
    )
  }

  return context
}

/**
 *
 * Radio Indicator component
 *
 */

type IndicatorOwnProps = {
  children?: React.ReactNode
}

type IndicatorProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, IndicatorOwnProps>

const __DEFAULT_INDICATOR_TAG__ = 'span'

type IndicatorType = <
  C extends React.ElementType = typeof __DEFAULT_INDICATOR_TAG__
>(
  props: IndicatorProps<C>
) => React.ReactElement | null

const Indicator: IndicatorType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_INDICATOR_TAG__>(
    { as, children, ...props }: IndicatorProps<C>,
    ref?: Polymorphic.Ref<C>
  ) => {
    const { checked } = useOptionContext('Indicator')

    const TagName = as || __DEFAULT_INDICATOR_TAG__

    return (
      <TagName ref={ref} {...props} data-checked={!checked}>
        {children}
      </TagName>
    )
  }
)

export const RadioGroup = Object.assign(Group, { Option, Label, Indicator })
