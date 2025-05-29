import React from 'react'
import { render } from '@testing-library/react'
import Home from '../../app/page'

// Mock para Next.js navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

const { redirect } = require('next/navigation')

describe('Main Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('ejecuta redirect a /register al renderizar', () => {
    render(<Home />)
    expect(redirect).toHaveBeenCalledWith('/register')
  })

  it('llama redirect exactamente una vez', () => {
    render(<Home />)
    expect(redirect).toHaveBeenCalledTimes(1)
  })
}) 