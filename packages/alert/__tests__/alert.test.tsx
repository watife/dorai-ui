import React from 'react'
import { render, screen } from '@testing-library/react'
import { Alert } from '../src'

describe('Alert render', () => {
  it('should render without crashing', () => {
    render(
      <Alert>
        <p>Alert component</p>
      </Alert>
    )

    expect(screen.queryByText(/alert component/i)).toBeInTheDocument()
  })
})
