import React from 'react'
import { Modal, useModalContext } from '@dorai-ui/modal'
import { callAll, mergeRefs, Polymorphic } from '@dorai-ui/utils'

/**
 * Alert Dialog Context
 */
const AlertDialogContext = React.createContext<{
  cancelRef: React.MutableRefObject<HTMLElement | null>
} | null>(null)

const useAlertDialogContext = (component: string) => {
  const context = React.useContext(AlertDialogContext)

  if (context === null) {
    throw new Error(
      `<AlertDialog.${component} /> component is not called within expected parent component`
    )
  }

  return context
}

/**
 *
 *
 * Root component
 *
 *
 */

type Arguments = {
  isOpen: boolean
}

type ModalType = {
  children: ((args: Arguments) => JSX.Element) | React.ReactNode
  isOpen?: boolean
  setIsOpen?: () => void
  initialFocus?: React.MutableRefObject<HTMLElement | null>
}

const Root = ({ children, ...props }: ModalType) => {
  const cancelRef = React.useRef<HTMLElement | null>(null)

  const propsToPass = {
    ...props,
    initialFocus: props.initialFocus || cancelRef
  }
  return (
    <AlertDialogContext.Provider value={{ cancelRef }}>
      <Modal {...propsToPass}>{children}</Modal>
    </AlertDialogContext.Provider>
  )
}

/**
 *
 *
 * Group component
 *
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

    return (
      <Modal.Group as={TagName} role='alertdialog' {...props} ref={ref}>
        {children}
      </Modal.Group>
    )
  }
)

/**
 *
 *
 * Cancel component which closes the Alert Dialog
 *
 *
 */
type CancelOwnProps = {
  children: React.ReactNode
}

type CancelProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, CancelOwnProps>

const __DEFAULT_CANCEL_TAG__ = 'button'

type CancelType = <C extends React.ElementType = typeof __DEFAULT_CANCEL_TAG__>(
  props: CancelProps<C>
) => React.ReactElement | null

const Cancel: CancelType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_CANCEL_TAG__>(
    { as, children, ...props }: CancelProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const { cancelRef } = useAlertDialogContext('Cancel')

    const mergedRef = mergeRefs([cancelRef, ref])

    const TagName = as || __DEFAULT_CANCEL_TAG__

    return (
      <Modal.Close as={TagName} {...props} ref={mergedRef}>
        {children}
      </Modal.Close>
    )
  }
)

/**
 *
 *
 * Action component
 *
 *
 */
type ActionOwnProps = {
  children: React.ReactNode
}

type ActionProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, ActionOwnProps>

const __DEFAULT_ACTION_TAG__ = 'button'

type ActionType = <C extends React.ElementType = typeof __DEFAULT_ACTION_TAG__>(
  props: ActionProps<C>
) => React.ReactElement | null

const Action: ActionType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_ACTION_TAG__>(
    { as, children, ...props }: ActionProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const TagName = as || __DEFAULT_ACTION_TAG__

    const { setIsOpen } = useModalContext('Action')

    const handleClickEvent = callAll(props.onClick, () => setIsOpen(false))

    const propsHandled = {
      ...props,
      onClick: handleClickEvent
    }

    return (
      <TagName as={TagName} {...propsHandled} ref={ref}>
        {children}
      </TagName>
    )
  }
)

export const AlertDialog = Object.assign(Root, {
  Group,
  Cancel,
  Action,
  Trigger: Modal.Trigger,
  Title: Modal.Title,
  Description: Modal.Description,
  Overlay: Modal.Overlay
})
