import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '../lib/switch'

describe('switch rendering', () => {
  it('renders switch component without crashing', () => {
    render(
      <Switch.Group>
        <Switch>
          <Switch.Indicator />
        </Switch>
        <Switch.Label>click to toggle</Switch.Label>
      </Switch.Group>
    )

    expect(screen.queryByRole(/switch/i)).toBeInTheDocument()
  })

  it('toggles switch if component is clicked', () => {
    render(
      <Switch.Group>
        <Switch>
          <Switch.Indicator />
        </Switch>
        <Switch.Label>click to toggle</Switch.Label>
      </Switch.Group>
    )

    expect(screen.queryByRole(/switch/i)).toBeInTheDocument()
    expect(screen.queryByText(/toggle on/i)).not.toBeInTheDocument()

    const toggleBtn = screen.getByText(/click to toggle/i)

    userEvent.click(toggleBtn)

    expect(
      screen.getByRole(/switch/i).getAttribute('aria-checked')
    ).toBeTruthy()
  })

  it('toggles if label is clicked', () => {
    render(
      <Switch.Group>
        <Switch>
          <Switch.Indicator />
        </Switch>
        <Switch.Label>Label component</Switch.Label>
      </Switch.Group>
    )

    const toggleBtn = screen.getByText(/Label component/i)

    userEvent.click(toggleBtn)

    expect(
      screen.getByRole(/switch/i).getAttribute('aria-checked')
    ).toBeTruthy()
  })

  it('renders checked props if passed as props', () => {
    render(
      <Switch.Group>
        <Switch checked>
          {({ checked }) => <>{checked ? <p>toggle on</p> : null}</>}
        </Switch>
      </Switch.Group>
    )

    expect(screen.queryByText(/toggle on/i)).toBeInTheDocument()
  })
})
