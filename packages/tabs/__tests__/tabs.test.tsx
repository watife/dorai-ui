import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from '../src'

type TabType = {
  manual?: boolean
}

const TabComp = ({ manual = false }: TabType) => {
  return (
    <Tabs manual={manual}>
      <Tabs.List>
        <Tabs.Trigger>tab 1</Tabs.Trigger>
        <Tabs.Trigger>tab 2</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel>tab panel 1</Tabs.Panel>
      <Tabs.Panel>tab panel 2</Tabs.Panel>
    </Tabs>
  )
}

describe('Safe rules of component', () => {
  it.each([
    ['List', Tabs.List],
    ['Trigger', Tabs.Trigger],
    ['Panel', Tabs.Panel]
  ])(
    'should error if component is rendered without a parent <Tabs />',
    (name, Component) => {
      expect(() => render(<Component>children</Component>)).toThrowError(
        `<Tabs.${name} /> component is not called within expected parent component`
      )
    }
  )
})

describe('Component Render', () => {
  it('renders tab component without crashing', () => {
    render(<TabComp />)

    expect(screen.getByText(/tab panel 1/i)).toBeVisible()
    expect(screen.queryByText(/tab panel 2/i)).not.toBeVisible()
    expect(screen.queryByRole(/tablist/i)).toBeVisible()
  })

  it('puts focus on tab', () => {
    render(<TabComp />)

    const tab1 = screen.getByText(/tab 1/i)

    userEvent.tab()

    expect(tab1).toHaveFocus()

    userEvent.keyboard('{arrowright}')

    expect(screen.getByText(/tab 2/i)).toHaveFocus()

    expect(screen.queryByText(/tab panel 1/i)).not.toBeVisible()
    expect(screen.getByText(/tab panel 2/i)).toBeVisible()
  })

  it('puts focus by manual trigger and panel shows when enter or space is clicked', () => {
    render(<TabComp manual />)

    const tab1 = screen.getByText(/tab 1/i)

    userEvent.tab()

    expect(tab1).toHaveFocus()

    userEvent.keyboard('{arrowright}')

    expect(screen.queryByText(/tab panel 1/i)).toBeVisible()
    expect(screen.queryByText(/tab panel 2/i)).not.toBeVisible()

    userEvent.keyboard('{enter}')

    expect(screen.queryByText(/tab panel 1/i)).not.toBeVisible()
    expect(screen.queryByText(/tab panel 2/i)).toBeVisible()
  })

  it('skips over disabled tab', () => {
    render(
      <Tabs>
        <Tabs.List>
          <Tabs.Trigger>tab 1</Tabs.Trigger>
          <Tabs.Trigger disabled>tab 2</Tabs.Trigger>
          <Tabs.Trigger>tab 3</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel>tab panel 1</Tabs.Panel>
        <Tabs.Panel>tab panel 2</Tabs.Panel>
        <Tabs.Panel>tab panel 3</Tabs.Panel>
      </Tabs>
    )

    const tab1 = screen.getByText(/tab 1/i)

    userEvent.tab()

    expect(tab1).toHaveFocus()

    userEvent.keyboard('{arrowright}')

    expect(screen.getByText(/tab 2/i)).not.toHaveFocus()
    expect(screen.getByText(/tab 3/i)).toHaveFocus()

    expect(screen.queryByText(/tab panel 2/i)).not.toBeVisible()
    expect(screen.queryByText(/tab panel 3/i)).toBeVisible()
  })

  it('activates clicked tab', () => {
    render(<TabComp />)

    const tab2 = screen.getByText(/tab 2/i)

    userEvent.click(tab2)

    expect(tab2).toHaveFocus()

    expect(screen.queryByText(/tab panel 2/i)).toBeVisible()
  })

  it('allows keyboard keys based on orientation set', () => {
    render(
      <Tabs vertical>
        <Tabs.List>
          <Tabs.Trigger>tab 1</Tabs.Trigger>
          <Tabs.Trigger>tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel>tab panel 1</Tabs.Panel>
        <Tabs.Panel>tab panel 2</Tabs.Panel>
      </Tabs>
    )

    userEvent.tab()

    userEvent.keyboard('{arrowright}')

    expect(screen.queryByText(/tab panel 2/i)).not.toBeVisible()

    userEvent.keyboard('{arrowdown}')

    expect(screen.queryByText(/tab panel 2/i)).toBeVisible()
  })

  it('last element goes to first element on further click and vice versa', () => {
    render(<TabComp />)

    userEvent.tab()

    // click on right arrow twice
    userEvent.keyboard('{arrowright}{arrowright}')

    expect(screen.queryByText(/tab panel 2/i)).not.toBeVisible()
    expect(screen.queryByText(/tab panel 1/i)).toBeVisible()

    // click on left arrow twice
    userEvent.keyboard('{arrowleft}{arrowleft}')

    expect(screen.queryByText(/tab panel 2/i)).not.toBeVisible()
    expect(screen.queryByText(/tab panel 1/i)).toBeVisible()
  })

  it('focuses on the first focusable element if defaultIndex is disabled', () => {
    render(
      <Tabs defaultIndex={1}>
        <Tabs.List>
          <Tabs.Trigger>tab 1</Tabs.Trigger>
          <Tabs.Trigger disabled>tab 2</Tabs.Trigger>
          <Tabs.Trigger>tab 3</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel>tab panel 1</Tabs.Panel>
        <Tabs.Panel>tab panel 2</Tabs.Panel>
        <Tabs.Panel>tab panel 3</Tabs.Panel>
      </Tabs>
    )

    const tab3 = screen.getByText(/tab 3/i)

    expect(tab3).toHaveFocus()
  })

  it("focuses on the first focusable if the defaultIndex doesn't match any tab", () => {
    render(
      <Tabs defaultIndex={10}>
        <Tabs.List>
          <Tabs.Trigger>tab 1</Tabs.Trigger>
          <Tabs.Trigger>tab 2</Tabs.Trigger>
          <Tabs.Trigger>tab 3</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel>tab panel 1</Tabs.Panel>
        <Tabs.Panel>tab panel 2</Tabs.Panel>
        <Tabs.Panel>tab panel 3</Tabs.Panel>
      </Tabs>
    )

    const tab1 = screen.getByText(/tab 1/i)

    expect(tab1).toHaveFocus()
  })
})
