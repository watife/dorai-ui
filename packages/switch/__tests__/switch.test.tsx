import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '../lib/switch'

describe('Safe rules of component', () => {
  it.each([['Switch.Trigger', Switch.Trigger]])(
    'should error if component is rendered without a parent <Switch />',
    (name, Component) => {
      expect(() => render(<Component>children</Component>)).toThrowError(
        `<${name} /> component is not called within expected parent component`
      )
    }
  )
})

describe('switch rendering', () => {
  it('renders switch component without crashing', () => {
    render(
      <Switch>
        <Switch.Trigger>click to toggle</Switch.Trigger>
      </Switch>
    )

    expect(screen.queryByRole(/switch/i)).toBeInTheDocument()
  })

  it('toggles switch if component is clicked', () => {
    render(
      <Switch>
        {({ checked }) => (
          <>
            <Switch.Trigger>click to toggle</Switch.Trigger>
            <Switch.Label>Label component</Switch.Label>
            {checked ? <p>toggle on</p> : null}
          </>
        )}
      </Switch>
    )

    expect(screen.queryByRole(/switch/i)).toBeInTheDocument()
    expect(screen.queryByText(/toggle on/i)).not.toBeInTheDocument()

    const toggleBtn = screen.getByText(/click to toggle/i)

    userEvent.click(toggleBtn)

    expect(screen.queryByText(/toggle on/i)).toBeInTheDocument()
  })

  it('toggles if label is clicked', () => {
    render(
      <Switch>
        {({ checked }) => (
          <>
            <Switch.Trigger id='toggle'>click to toggle</Switch.Trigger>
            <Switch.Label htmlFor='toggle'>Label component</Switch.Label>
            {checked ? <p>toggle on</p> : null}
          </>
        )}
      </Switch>
    )

    const toggleBtn = screen.getByText(/Label component/i)

    userEvent.click(toggleBtn)

    expect(screen.queryByText(/toggle on/i)).toBeInTheDocument()
  })

  it('renders checked component if passed as props', () => {
    render(
      <Switch checked>
        {({ checked }) => <>{checked ? <p>toggle on</p> : null}</>}
      </Switch>
    )

    expect(screen.queryByText(/toggle on/i)).toBeInTheDocument()
  })
})
