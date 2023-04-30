import { Modal, useModalContext } from '@dorai-ui/modal'
import { callAll } from '@dorai-ui/utils/call-all'
import { mergeRefs } from '@dorai-ui/utils/merge-refs'
import * as Polymorphic from '@dorai-ui/utils/polymorphic'
import React from 'react'

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
type ModalGroupOwnProps = {
  children: React.ReactNode
}

type ModalProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, ModalGroupOwnProps>

const __DEFAULT_MODAL_GROUP_TAG__ = 'div'

type ModalGroupType = <
  C extends React.ElementType = typeof __DEFAULT_MODAL_GROUP_TAG__
>(
  props: ModalProps<C>
) => React.ReactElement | null

const Group: ModalGroupType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_MODAL_GROUP_TAG__>(
    { as, children, ...props }: ModalProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const TagName = as || __DEFAULT_MODAL_GROUP_TAG__

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
    const TagName = as || __DEFAULT_CANCEL_TAG__

    const { cancelRef } = useAlertDialogContext('Cancel')

    const mergedRef = mergeRefs([cancelRef, ref])

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

    function propsClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
      e.stopPropagation()
      if (props.onClick) {
        props.onClick(e)
      }
    }

    const handleClickEvent = callAll(propsClick, () => setIsOpen(false))

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
