import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Tooltip } from '../src'

describe('Safe rules of component', () => {
  it.each([
    ['Tooltip.Trigger', Tooltip.Trigger],
    ['Tooltip.Content', Tooltip.Content]
  ])(
    'should error if component is rendered without a parent <Tooltip />',
    (name, Component) => {
      expect(() => render(<Component>children</Component>)).toThrowError(
        `<${name} /> component is not called within expected parent component`
      )
    }
  )
})

describe('tooltip rendering', () => {
  it('should render a tootip content on hover and focus', () => {
    render(
      <Tooltip>
        <Tooltip.Trigger>Trigger</Tooltip.Trigger>
        <Tooltip.Content>Tooltip content</Tooltip.Content>
      </Tooltip>
    )

    const triggerBtn = screen.getByRole('button')

    userEvent.hover(triggerBtn)

    expect(screen.getByText('Tooltip content')).toBeInTheDocument()

    userEvent.unhover(triggerBtn)

    waitFor(() =>
      expect(screen.findByText('Tooltip content')).not.toBeInTheDocument()
    )

    userEvent.tab()

    expect(triggerBtn).toHaveFocus()

    expect(screen.getByText('Tooltip content')).toBeInTheDocument()

    userEvent.tab()

    expect(triggerBtn).not.toHaveFocus()

    waitFor(() =>
      expect(screen.findByText('Tooltip content')).not.toBeInTheDocument()
    )
  })
})
