import React from 'react'
import { useFocusLock } from '../../hooks/use-focus-lock'
import { callAll } from '../../utils/call-all'
import { KeyBoardKeys } from '../../enums/keyboard'
import { mergeRefs } from '../../utils/merge-ref'
import type * as Polymorphic from '../../utils/polymophic'

import {
  Description,
  DescriptionContextProvider,
  useDescriptionValue
} from '../description'
import { Portal } from '../portal'

/**
 *
 *
 * Modal root component
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

const ModalContext = React.createContext<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  initialFocus?: React.MutableRefObject<HTMLElement | null>
} | null>(null)

const ModalRoot = ({
  children,
  isOpen,
  setIsOpen: setIsOpenProps,
  initialFocus
}: ModalType) => {
  const [open, setOpen] = React.useState<boolean>(isOpen || false)

  const modalProvider = {
    isOpen: isOpen || open,
    setIsOpen: setIsOpenProps || setOpen,
    initialFocus: initialFocus
  }

  const render = () => {
    if (typeof children === 'function') {
      return children({ isOpen: open })
    }

    return children
  }

  return (
    <ModalContext.Provider value={modalProvider}>
      <DescriptionContextProvider>{render()}</DescriptionContextProvider>
    </ModalContext.Provider>
  )
}

const useModalContext = (component: string) => {
  const context = React.useContext(ModalContext)

  if (context === null) {
    throw new Error(
      `<Modal.${component} /> component is not called within expected parent component`
    )
  }

  return context
}

/**
 *
 * Modal Group composes the other components
 *
 */
type ModalGroupOwnProps = {
  children: React.ReactNode
}
type ModalProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, ModalGroupOwnProps>

const __DEFAULT_MODAL_GROUP__ = 'div'

type ModalGroupType = <
  C extends React.ElementType = typeof __DEFAULT_MODAL_GROUP__
>(
  props: ModalProps<C>
) => React.ReactElement | null

const Group: ModalGroupType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_MODAL_GROUP__>(
    { as, children, ...props }: ModalProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const context = useModalContext('Group')

    const internalRef = React.useRef(null)

    const mergedRef = mergeRefs([internalRef, ref])

    const closeModal = () => context.setIsOpen(false)

    const descriptionContext = useDescriptionValue()

    const handleEvent = (event: React.KeyboardEvent<HTMLElement>): void => {
      if (event.key === KeyBoardKeys.Escape) {
        event.stopPropagation()
        closeModal()
      }
    }

    // lock focus within the modal
    useFocusLock(internalRef, context.initialFocus)

    // scroll lock
    React.useEffect(() => {
      if (!context.isOpen) return

      const rootOverflow = document.documentElement.style.overflow

      document.documentElement.style.overflow = 'hidden'

      return () => {
        document.documentElement.style.overflow = rootOverflow
      }
    }, [context.isOpen])

    const TagName = as || __DEFAULT_MODAL_GROUP__

    if (!context.isOpen) return null

    return (
      <Portal id='modal-portal'>
        <TagName
          {...props}
          aria-modal
          role='dialog'
          tabIndex={-1}
          aria-labelledby='dorai-ui-modal-title'
          aria-describedby={descriptionContext?.ids}
          ref={mergedRef}
          onKeyDown={handleEvent}
        >
          {children}
        </TagName>
      </Portal>
    )
  }
)

/**
 *
 * Modal Button component for opening and closing modal dialog
 *
 */
type ButtonOwnProps = {
  children: React.ReactNode
}

type ButtonProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, ButtonOwnProps>

const __DEFAULT_BUTTON__ = 'button'

type ButtonType = <C extends React.ElementType = typeof __DEFAULT_BUTTON__>(
  props: ButtonProps<C>
) => React.ReactElement | null

const Button: ButtonType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_BUTTON__>(
    { as, children, ...props }: ButtonProps<C>,
    ref?: Polymorphic.Ref<C>
  ) => {
    const context = useModalContext('Button')

    const TagName = as || __DEFAULT_BUTTON__

    const handleClicks = callAll(props.onClick, () =>
      context.setIsOpen((prev) => !prev)
    )

    const propsHandled = {
      ...props,
      onClick: handleClicks
    }

    return (
      <TagName {...propsHandled} ref={ref}>
        {children}
      </TagName>
    )
  }
)

/**
 *
 *
 * Title component for the modal
 *
 *
 */
type TitleOwnProps = {
  children: string
}

type TitleProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C, TitleOwnProps>

const __DEFAULT_TITLE_TAG__ = 'h2'

type TitleType = <C extends React.ElementType = typeof __DEFAULT_TITLE_TAG__>(
  props: TitleProps<C>
) => React.ReactElement | null

const Title: TitleType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_TITLE_TAG__>(
    { as, children, ...props }: TitleProps<C>,
    ref?: Polymorphic.Ref<C>
  ) => {
    useModalContext('Title')

    const TagName = as || __DEFAULT_TITLE_TAG__
    return (
      <TagName {...props} id='dorai-ui-modal-title' ref={ref}>
        {children}
      </TagName>
    )
  }
)

/**
 *
 *
 * Overlay component for the modal, should enable clickables to cancel modal but also any other calls
 *
 *
 */

type OverlayProps<C extends React.ElementType> =
  Polymorphic.ComponentPropsWithRef<C>

type OverlayType = <C extends React.ElementType = 'div'>(
  props: OverlayProps<C>
) => React.ReactElement | null

const __DEFAULT_OVERLAY_TAG__ = 'div'

const Overlay: OverlayType = React.forwardRef(
  <C extends React.ElementType = typeof __DEFAULT_OVERLAY_TAG__>(
    { as, ...props }: OverlayProps<C>,
    ref: Polymorphic.Ref<C>
  ) => {
    const context = useModalContext('Overlay')
    const overlayRef = React.useRef(null)

    const mergedRef = mergeRefs([overlayRef, ref])

    const closeModal = () => context.setIsOpen((prev) => !prev)

    const handleCloseOnOverlay = (
      event: React.MouseEvent<HTMLElement, MouseEvent>
    ) => {
      if (event.target === overlayRef.current) {
        closeModal()
      }
    }

    const handleEvent = (event: React.KeyboardEvent<HTMLElement>): void => {
      if (event.key === KeyBoardKeys.Escape) {
        event.stopPropagation()
        closeModal()
      }
    }

    const propsHandled = {
      ...props,
      onClick: handleCloseOnOverlay,
      onMouseDown: handleCloseOnOverlay,
      onKeyDown: handleEvent
    }

    const TagName = as || __DEFAULT_OVERLAY_TAG__

    return <TagName ref={mergedRef} {...propsHandled} />
  }
)

export const Modal = Object.assign(ModalRoot, {
  Group,
  Button,
  Title,
  Description,
  Overlay
})
