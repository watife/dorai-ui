import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup } from '../src'

describe('Safe rules of component', () => {
  it.each([['Option', RadioGroup.Option]])(
    'should error if component is rendered without a parent <Tabs />',
    (name, Component) => {
      expect(() =>
        render(<Component value='1'>children</Component>)
      ).toThrowError(
        `<RadioGroup.${name} /> component is not called within expected parent component`
      )
    }
  )

  it('echos error if Indicator is called outside of Option Tag', () => {
    expect(() =>
      render(<RadioGroup.Indicator>children</RadioGroup.Indicator>)
    ).toThrowError(
      `<RadioGroup.Indicator /> component is not called within <RadioGroup.Option /> component`
    )
  })
})

describe('radiogroup rendering', () => {
  it('renders radiogroup component without crashing', () => {
    render(
      <RadioGroup value='option 1' onChange={jest.fn()}>
        <RadioGroup.Label>This is radio group</RadioGroup.Label>
        <RadioGroup.Label>This is radio group</RadioGroup.Label>
        <RadioGroup.Option value='option 1'>option 1 checked</RadioGroup.Option>
      </RadioGroup>
    )

    expect(screen.getByRole(/radiogroup/i)).toBeInTheDocument()
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('the first option is focusable', () => {
    render(
      <RadioGroup value='option 1' onChange={jest.fn()}>
        <RadioGroup.Label>This is radio group</RadioGroup.Label>
        <RadioGroup.Label>This is radio group</RadioGroup.Label>
        <RadioGroup.Option value='option 1'>option 1 checked</RadioGroup.Option>
        <RadioGroup.Option value='option 2'>option 2 checked</RadioGroup.Option>
      </RadioGroup>
    )

    userEvent.tab()

    expect(screen.getByText('option 1 checked')).toHaveFocus()
  })

  it('focuses on the next focuable option when arrow down is clicked', () => {
    render(
      <RadioGroup value='option 1' onChange={jest.fn()}>
        <RadioGroup.Label>This is radio group</RadioGroup.Label>
        <RadioGroup.Label>This is radio group</RadioGroup.Label>
        <RadioGroup.Option value='option 1'>option 1 checked</RadioGroup.Option>
        <RadioGroup.Option value='option 2' disabled>
          option 2 checked
        </RadioGroup.Option>
        <RadioGroup.Option value='option 3'>option 3 checked</RadioGroup.Option>
      </RadioGroup>
    )

    userEvent.tab()

    userEvent.keyboard('{arrowdown}')

    expect(screen.getByText('option 3 checked')).toHaveFocus()

    userEvent.keyboard('{arrowdown}')

    expect(screen.getByText('option 1 checked')).toHaveFocus()

    userEvent.keyboard('{arrowup}')

    expect(screen.getByText('option 3 checked')).toHaveFocus()

    userEvent.keyboard('{arrowup}{arrowup}')

    expect(screen.getByText('option 3 checked')).toHaveFocus()
  })
})
