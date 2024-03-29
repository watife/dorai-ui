import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Modal } from '../src/modal'

type ModalCompType = {
  open?: boolean
}

const ModalComp = ({ open }: ModalCompType) => {
  return (
    <Modal isOpen={open}>
      <Modal.Group>
        <Modal.Overlay />
        <Modal.Title>Title</Modal.Title>
        <Modal.Description>Modal description</Modal.Description>
        <Modal.Close>Close Modal</Modal.Close>
      </Modal.Group>
    </Modal>
  )
}

describe('Safe rules of component', () => {
  it.each([
    ['Modal.Overlay', Modal.Overlay],
    ['Modal.Title', Modal.Title],
    ['Modal.Trigger', Modal.Trigger],
    ['Modal.Group', Modal.Group]
  ])(
    'should error if component is rendered without a parent <Modal />',
    (name, Component) => {
      expect(() => render(<Component>children</Component>)).toThrowError(
        `<${name} /> component is not called within expected parent component`
      )
    }
  )
})

describe('Modal render', () => {
  it("doesn't render if Modal is not open", () => {
    render(<ModalComp />)

    expect(screen.queryByRole(/dialog/i)).toBeNull()
    expect(screen.queryByText(/title/i)).toBeNull()
    expect(screen.queryByText(/Modal description/i)).toBeNull()
  })

  it('renders modal without crashing', () => {
    render(<ModalComp open />)

    expect(screen.queryByRole(/dialog/i)).toBeInTheDocument()
    expect(screen.getByText(/title/i)).toBeInTheDocument()
    expect(screen.getByText(/Modal description/i)).toBeInTheDocument()
  })

  it('renders modal when modal Trigger is clicked', () => {
    render(
      <Modal>
        <Modal.Trigger>Open modal</Modal.Trigger>
        <Modal.Group>
          <Modal.Overlay />
          <Modal.Title>Title</Modal.Title>
          <Modal.Description>Modal description</Modal.Description>
        </Modal.Group>
      </Modal>
    )

    const modalBtn = screen.getByText(/open modal/i)

    userEvent.click(modalBtn)

    expect(screen.queryByRole(/dialog/i)).toBeInTheDocument()
    expect(screen.getByText(/title/i)).toBeInTheDocument()
    expect(screen.getByText(/Modal description/i)).toBeInTheDocument()
  })

  it('closes modal when Modal Close is clicked', () => {
    render(
      <Modal>
        <Modal.Trigger>Open modal</Modal.Trigger>
        <Modal.Group>
          <Modal.Overlay />
          <Modal.Title>Title</Modal.Title>
          <Modal.Description>Modal description</Modal.Description>
          <Modal.Close>Close modal</Modal.Close>
        </Modal.Group>
      </Modal>
    )

    const modalBtn = screen.getByText(/open modal/i)

    userEvent.click(modalBtn)

    userEvent.click(screen.getByText(/close modal/i))

    expect(screen.queryByRole(/dialog/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/title/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Modal description/i)).not.toBeInTheDocument()
  })

  it('closes Modal when overlay is absent and outside modal is clicked', () => {
    render(
      <div data-testid='body'>
        <Modal>
          <Modal.Trigger>Open modal</Modal.Trigger>
          <Modal.Group>
            <Modal.Title>Title</Modal.Title>
            <Modal.Description>Modal description</Modal.Description>
            <Modal.Close>Close modal</Modal.Close>
          </Modal.Group>
        </Modal>
      </div>
    )

    const modalBtn = screen.getByText(/open modal/i)

    userEvent.click(modalBtn)

    expect(screen.queryByText(/title/i)).toBeInTheDocument()

    const bodyTag = screen.getByTestId('body')

    userEvent.click(bodyTag)

    expect(screen.queryByRole(/dialog/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/title/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Modal description/i)).not.toBeInTheDocument()
  })
})
