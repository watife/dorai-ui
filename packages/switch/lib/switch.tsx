import React from 'react'
import { callAll, GetId, KeyBoardKeys, Polymorphic } from '@dorai-ui/utils'
import { LabelContextProvider, useLabelValue, Label } from '@dorai-ui/label'

const GroupContext = React.createContext<{
  id: string
} | null>(null)
/**
 *
 *  Group composes the other components
 *
 */
type GroupOwnProps = {
  children: React.ReactNode
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
    const TagName = as || __DEFAULT_GROUP_TAG__

    const id = `dorai-ui-switch-${GetId()}`
    return (
      <GroupContext.Provider value={{ id }}>
        <LabelContextProvider htmlFor={id}>
          <TagName {...props} ref={ref}>
            {children}
          </TagName>
        </LabelContextProvider>
      </GroupContext.Provider>
    )
  }
)

const useGroupContext = () => {
  const context = React.useContext(GroupContext)

  if (context === null) {
    throw new Error(
      `<Switch /> component is not called within expected parent component`
    )
  }

  return context
}

/**
 *
 * Toggle Root component
 *
 */
type RootOwnProps = {
  children: ((args: { checked: boolean }) => JSX.Element) | React.ReactNode
  checked?: boolean
  onChange?: (() => void) | undefined
  disabled?: boolean
  value?: string
}

type RootProps<C extends React.ElementType> = Polymorphic.ComponentPropsWithRef<
  C,
  RootOwnProps
>

const __DEFAULT_ROOT_TAG__ = 'button'

type RootType = <C extends React.ElementType = typeof __DEFAULT_ROOT_TAG__>(
  props: RootProps<C>
) => React.ReactElement | null

const SwitchRoot: RootType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_ROOT_TAG__>(
    {
      as,
      children,
      checked,
      disabled,
      onChange,
      value,
      ...props
    }: RootProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const [isChecked, setIsChecked] = React.useState(false)
    React.useEffect(() => {
      if (typeof checked === 'undefined') return
      setIsChecked(checked)
    }, [checked])

    const toggle =
      checked && typeof onChange === 'function'
        ? onChange
        : () => setIsChecked((prev) => !prev)

    const render = () => {
      if (typeof children === 'function') {
        return children({ checked: isChecked })
      }

      return children
    }

    const { id } = useGroupContext()

    const { ids } = useLabelValue()

    const handleClicks = disabled
      ? undefined
      : callAll(props.onClick, () => toggle())

    const handleKeyEvent = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        if (
          event.key !== KeyBoardKeys.Space &&
          event.key !== KeyBoardKeys.Enter
        )
          return

        event.preventDefault()

        return handleClicks?.()
      },
      [handleClicks]
    )

    const propsHandled = {
      ...props,
      onClick: handleClicks
    }

    const TagName = as || __DEFAULT_ROOT_TAG__

    return (
      <TagName
        role='switch'
        aria-checked={isChecked}
        aria-readonly={disabled}
        aria-labelledby={ids}
        id={id}
        tabIndex={0}
        onKeyDown={(e) => callAll(props.keyDown, () => handleKeyEvent(e))}
        {...propsHandled}
        ref={ref}
        value={value}
      >
        {render()}
      </TagName>
    )
  }
)

/**
 *
 * Toggle Indicator component
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
    const TagName = as || __DEFAULT_INDICATOR_TAG__

    return (
      <TagName ref={ref} {...props}>
        {children}
      </TagName>
    )
  }
)

export const Switch = Object.assign(SwitchRoot, { Group, Indicator, Label })
