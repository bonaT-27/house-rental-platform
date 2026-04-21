import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

const TestComponent = () => {
  return <div data-testid="test-div">Hello House Rental App!</div>
}

describe('Example Test', () => {
  it('should render correctly', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('test-div')).toBeInTheDocument()
    expect(screen.getByText('Hello House Rental App!')).toBeInTheDocument()
  })
})