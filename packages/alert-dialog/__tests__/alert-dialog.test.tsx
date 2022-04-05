import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AlertDialog } from '../src'

type AlertDialogCompType = {
  open?: boolean
}

const AlertDialogComp = ({ open }: AlertDialogCompType) => {
  return (
    <AlertDialog isOpen={open}>
      <AlertDialog.Trigger>Open AlertDialog</AlertDialog.Trigger>
      <AlertDialog.Group>
        <AlertDialog.Title>Destructive activity</AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be reversed once clicked, please be certain you
          want to proceed!
        </AlertDialog.Description>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action>Delete</AlertDialog.Action>
      </AlertDialog.Group>
    </AlertDialog>
  )
}

describe('AlertDialog render', () => {
  it("doesn't render if AlertDialog is not open", () => {
    render(<AlertDialogComp />)

    expect(screen.queryByRole(/alertdialog/i)).toBeNull()
    expect(screen.queryByText(/destructive activity/i)).toBeNull()
    expect(
      screen.queryByText(
        /This action cannot be reversed once clicked, please be certain you want to proceed!/i
      )
    ).toBeNull()
  })

  it('renders AlertDialog without crashing', () => {
    render(<AlertDialogComp open />)

    expect(screen.queryByRole(/alertdialog/i)).toBeInTheDocument()
    expect(screen.getByText(/destructive activity/i)).toBeInTheDocument()
    expect(
      screen.getByText(
        /This action cannot be reversed once clicked, please be certain you want to proceed!/i
      )
    ).toBeInTheDocument()
  })

  it('renders AlertDialog when AlertDialog Trigger is clicked', () => {
    render(
      <AlertDialog>
        <AlertDialog.Trigger>Open AlertDialog</AlertDialog.Trigger>
        <AlertDialog.Group>
          <AlertDialog.Overlay />
          <AlertDialog.Title>Title</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be reversed once clicked, please be certain you
            want to proceed!
          </AlertDialog.Description>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>Action</AlertDialog.Action>
        </AlertDialog.Group>
      </AlertDialog>
    )

    const modalBtn = screen.getByText(/Open AlertDialog/i)

    userEvent.click(modalBtn)

    expect(screen.queryByRole(/alertdialog/i)).toBeInTheDocument()
    expect(screen.getByText(/title/i)).toBeInTheDocument()
    expect(
      screen.getByText(
        /This action cannot be reversed once clicked, please be certain you want to proceed!/i
      )
    ).toBeInTheDocument()
    expect(screen.getByText(/cancel/i)).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('closes modal when Alert Dialog cancel is clicked', () => {
    render(
      <AlertDialog>
        <AlertDialog.Trigger>Open AlertDialog</AlertDialog.Trigger>
        <AlertDialog.Group>
          <AlertDialog.Overlay />
          <AlertDialog.Title>Title</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be reversed once clicked, please be certain you
            want to proceed!
          </AlertDialog.Description>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>Delete</AlertDialog.Action>
        </AlertDialog.Group>
      </AlertDialog>
    )

    const modalBtn = screen.getByText(/Open AlertDialog/i)

    userEvent.click(modalBtn)

    userEvent.click(screen.getByText(/cancel/i))

    expect(screen.queryByRole(/alertdialog/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/destructive activity/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /This action cannot be reversed once clicked, please be certain you want to proceed!/i
      )
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument()
    expect(screen.queryByText('Action')).not.toBeInTheDocument()
  })

  it('performs expected action and closes dialog if action is clicked', () => {
    const handleClick = jest.fn()
    render(
      <AlertDialog>
        <AlertDialog.Trigger>Open AlertDialog</AlertDialog.Trigger>
        <AlertDialog.Group>
          <AlertDialog.Overlay />
          <AlertDialog.Title>Title</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be reversed once clicked, please be certain you
            want to proceed!
          </AlertDialog.Description>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action onClick={handleClick}>Delete</AlertDialog.Action>
        </AlertDialog.Group>
      </AlertDialog>
    )

    const modalBtn = screen.getByText(/Open AlertDialog/i)

    userEvent.click(modalBtn)

    userEvent.click(screen.getByText(/delete/i))

    expect(handleClick).toHaveBeenCalled()

    expect(screen.queryByRole(/dialog/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/title/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /This action cannot be reversed once clicked, please be certain you want to proceed!/i
      )
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/cancel/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/action/i)).not.toBeInTheDocument()
  })
})
