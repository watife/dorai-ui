import React from 'react'
import { callAll, KeyBoardKeys, Polymorphic } from '@dorai-ui/utils'
import { LabelContextProvider, Label } from '@dorai-ui/label'

type RootOwnProps = {
  children: ((args: { checked: boolean }) => JSX.Element) | React.ReactNode
  checked?: boolean
  onChange?: (() => void) | undefined
  disabled?: boolean
  value?: unknown
}

type RootProps<C extends React.ElementType> = Polymorphic.ComponentPropsWithRef<
  C,
  RootOwnProps
>

const __DEFAULT_ROOT_TAG__ = 'div'

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
      <LabelContextProvider>
        {({ ids }) => (
          <TagName
            role='switch'
            aria-checked={isChecked}
            aria-readonly={disabled}
            aria-labelledby={ids}
            tabIndex={0}
            onKeyDown={(e) => callAll(props.keyDown, () => handleKeyEvent(e))}
            {...propsHandled}
            ref={ref}
            value={value}
          >
            {render()}
          </TagName>
        )}
      </LabelContextProvider>
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

export const Switch = Object.assign(SwitchRoot, { Indicator, Label })
