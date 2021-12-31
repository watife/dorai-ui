import React from 'react'
import { render } from '@testing-library/react'
import { Label } from '../lib'

describe('Safe rules of component', () => {
  it.each([['Label', Label]])(
    'should error if component is rendered without a parent <Switch />',
    (name, Component) => {
      expect(() => render(<Component>children</Component>)).toThrowError(
        `<${name} /> component is not called within expected parent component`
      )
    }
  )
})
