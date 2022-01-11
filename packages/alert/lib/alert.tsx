import React from 'react'
import { Polymorphic } from '@dorai-ui/utils'

type AlertOwnProps = {
  children: React.ReactNode
}

type AlertProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, AlertOwnProps>

const __DEFAULT_ALERT_TAG__ = 'div'

type AlertType = <C extends React.ElementType = typeof __DEFAULT_ALERT_TAG__>(
  props: AlertProps<C>
) => React.ReactElement | null

const Alert: AlertType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_ALERT_TAG__>(
    { as, children, ...props }: AlertProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const TagName = as || __DEFAULT_ALERT_TAG__

    return (
      <TagName role='alert' {...props} ref={ref}>
        {children}
      </TagName>
    )
  }
)

export { Alert }
