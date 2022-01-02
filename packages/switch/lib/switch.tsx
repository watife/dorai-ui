import React from 'react'
import { callAll, KeyBoardKeys, Polymorphic } from '@dorai-ui/utils'
import { LabelContextProvider, useLabelValue, Label } from '@dorai-ui/label'

const SwitchContext = React.createContext<{
  isChecked: boolean
  toggle: () => void
  disabled?: boolean
} | null>(null)

type Arguments = {
  checked: boolean
}

type SwitchType = {
  children: ((args: Arguments) => JSX.Element) | React.ReactNode
  checked?: boolean
  disabled?: boolean
}

const SwitchRoot = ({ children, checked, disabled }: SwitchType) => {
  const [isChecked, setIsChecked] = React.useState(checked || false)

  const toggle = () => setIsChecked((prev) => !prev)

  const switchProvider = {
    isChecked,
    toggle,
    disabled
  }

  const render = () => {
    if (typeof children === 'function') {
      return children({ checked: isChecked })
    }

    return children
  }

  return (
    <SwitchContext.Provider value={switchProvider}>
      <LabelContextProvider>{render()}</LabelContextProvider>
    </SwitchContext.Provider>
  )
}

const useSwitchValue = (component: string) => {
  const context = React.useContext(SwitchContext)

  if (context === null) {
    throw new Error(
      `<Switch.${component} /> component is not called within expected parent component`
    )
  }

  return context
}

/**
 *
 * Toggle Trigger component
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
    const context = useSwitchValue('Trigger')

    const labelContext = useLabelValue()

    const TagName = as || __DEFAULT_TRIGGER_TAG__

    const handleClicks = context.disabled
      ? undefined
      : callAll(props.onClick, () => context.toggle())

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

    return (
      <TagName
        role='switch'
        aria-checked={context.isChecked}
        aria-readonly={context.disabled}
        aria-labelledby={labelContext?.ids}
        tabIndex={0}
        onKeyDown={(e) => callAll(props.keyDown, () => handleKeyEvent(e))}
        {...propsHandled}
        ref={ref}
      >
        {children}
      </TagName>
    )
  }
)

export const Switch = Object.assign(SwitchRoot, { Trigger, Label })
