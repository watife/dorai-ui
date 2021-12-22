import React from 'react'
import { callAll } from '../../utils/call-all'
// eslint-disable-next-line no-unused-vars
import type * as Polymorphic from '../../utils/polymophic'
import { LabelContextProvider, useLabelValue, Label } from '../label'

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
 * Toggle Button component
 *
 */
type ButtonOwnProps = {
  children: React.ReactNode
}

type ButtonProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, ButtonOwnProps>

const __DEFAULT_BUTTON_TAG__ = 'button'

type ButtonType = <C extends React.ElementType = typeof __DEFAULT_BUTTON_TAG__>(
  props: ButtonProps<C>
) => React.ReactElement | null

const Button: ButtonType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_BUTTON_TAG__>(
    { as, children, ...props }: ButtonProps<C>,
    ref?: Polymorphic.Ref<C>
  ) => {
    const context = useSwitchValue('Button')

    const labelContext = useLabelValue()

    const TagName = as || __DEFAULT_BUTTON_TAG__

    const handleClicks = context.disabled
      ? undefined
      : callAll(props.onClick, () => context.toggle())

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
        {...propsHandled}
        ref={ref}
      >
        {children}
      </TagName>
    )
  }
)

export const Switch = Object.assign(SwitchRoot, { Button, Label })
